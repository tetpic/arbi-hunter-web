import {createContext, MutableRefObject, RefObject, useContext, useEffect, useRef, useState} from 'react'
import IChat, { IChatFolder, IChatsFilter, MessageFilterOptions } from 'data/interfaces/IChat'
import ChatRepository from 'data/repositories/ChatRepository'
import {debounce} from 'debounce'
import {useChatSocketContext} from 'context/chat_socket_state'
import useWindowFocus from 'use-window-focus'
import { useUserContext } from './user_state'
import { useRouter } from 'next/router'
import { useAppContext } from './state'


interface IState {
  chats: Map<number, IChat>
  currentChatId: number | null,
  totalChats: number
  fetchMore: () => void
  loading: boolean
  filter: IChatsFilter
  setFilter: (filter?: IChatsFilter) => void,
  decreaseUnreadCount: (chatId: number) => void
  setCurrentChatId: (chatId: number | null) => void,
  scrollableTarget: RefObject<HTMLElement> | null
  foldersActive: boolean
  setFoldersActive: ()=>void
  folders: Map<number, IChatFolder>
  createChatFolder: (name: string, chats: IChat[]) => Promise<boolean>
  editChatFolder: (data: {chatFolderId: number, chatsIds: number[] }, name: string) => Promise<boolean>
  removeChatFolder: (id: number) => Promise<boolean> 
  setChatsFromFolder: (name: string) => void
  chatsRef:  MutableRefObject<Map<number, IChat>>
  component: Map<ChatComponent, boolean>
  setComponent: (_pages: {
    component: ChatComponent;
    active: boolean;
  }[]) => void
  editChat: (data: IChat) => void
  removeChat: (chatId: number) => void
  
}

export enum ChatComponent {
  Dialog = 'dialog',
  Chat = 'chat', 
  Folder= 'folder'
}


const ChatContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
  initialChat?: number
}


export function ChatWrapper(props: Props) {
  const userContext = useUserContext()
  const {isTabletWidth} = useAppContext().size
  const isLogged = userContext.isLogged
  const router = useRouter()

  const chatSocket = useChatSocketContext()
  const abortControllerRef = useRef<AbortController | null>(null)
  const windowFocused = useWindowFocus()
  const isLoggedRef = useRef<boolean>(isLogged)
  const scrollableTarget = useRef<HTMLElement | null>(null)
  const [chats, setChats] = useState<Map<number, IChat>>(new Map)
  const [currentChatId, setCurrentChatId] = useState<number | null>(props.initialChat)
  const [totalChats, setTotalChats] = useState<number>(null)
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [foldersActive, setFoldersActiveState] = useState<boolean>(false)
  const [folders, setFolders] = useState<Map<number, any>>(new Map)
  const [component, setComponentState] = useState<Map<ChatComponent, boolean>>(new Map([
    [ChatComponent.Chat, true], 
    [ChatComponent.Dialog, true], 
    [ChatComponent.Folder, false]]
  ))


  const [filter, setFilterState] = useState<IChatsFilter>(null)
  const chatsRef = useRef<Map<number, IChat>>(new Map)
  const windowFocusInit = useRef(false)
  
  const editChat = (data: IChat) => {
    setChats(state=> {
      state.set(data.id, data)
      return new Map(state)
    })
  }

  const removeChat = (chatId: number) => {
    setChats(state=> {
      state.delete(chatId)
      return new Map(state)
    })
  }

  const loadChats = async (page: number, filters?: MessageFilterOptions) => {
    if (abortControllerRef.current) {
      abortControllerRef.current?.abort()
    }
    abortControllerRef.current = new AbortController()
    try {
      const data = await ChatRepository.getChatList(filters, {signal: abortControllerRef.current?.signal!})
      abortControllerRef.current = null
      setChats(state=> {
        state.clear()
        data.data.forEach(el=> {
          state.set(el.id, el)
        })
        return new Map(state)
      })
      chatsRef.current.size === 0&&(chatsRef.current = new Map(data.data.map(el=> [el.id, el])))
      setTotalChats(data.total)
    } catch (e) {
      return
    }
  }

  const setFoldersFromInit = async():Promise<boolean> => {
    const folders = await ChatRepository.getChatFolders()
    setFolders(_=> new Map(folders.data.map(el=> [el.id, el])))
    return true
  }

  const init = async () => {
    await loadChats(1)
    await setFoldersFromInit()
    setTimeout(()=>setLoading(false), 300)
  }

  const fetchMore = async () => {
    await loadChats(page + 1)
    setPage(page + 1)
  }

  const setFilter = (data?: IChatsFilter) => {
    
    if(!data) {
      setChats(chatsRef.current)
      setFilterState(null)
      return
    }
    let filterData:MessageFilterOptions = {}
    data.status !== 'all'&&data.status&&(filterData.applicationStatus = data.status)
    data.vacanciesIds.length > 0&&(filterData.vacanciesIds = data.vacanciesIds.join(','))
    data.inactive&&(filterData.inactive = data.inactive)
    data.unreaded&& (filterData.onlyUnread = data.unreaded)

    setFilterState(data)
    loadChats(1, filterData)
  }

  const decreaseUnreadCount = (chatId: number)=> {
    if(chats.size === 0) return
    setChats(state=> {
      const chatNeeded = state.get(chatId)
      if(!chatNeeded) return state
      chatNeeded.totalUnread = 0
      return new Map(state)
    })
  }

  const setFoldersActive = () => {
    setFoldersActiveState(!foldersActive)
  }

  const removeChatFolder = async (id: number): Promise<boolean> => {
    await ChatRepository.deleteChatFolder(id)
    setFolders(state => {
      state.delete(id)
      return new Map(state)
    })
    return true
  }

  const setChatsFromFolder = async (chatName: string) => {
    const folderToSet = [...folders.values()].find(el => el.name === chatName)||null
    if(folderToSet) {
      const chats = await ChatRepository.getChatList({chatFolderId: folderToSet.id})
      setChats(new Map(chats.data.map(el=> [el.id, el])))
      router.replace({query: { ...router.query, chat: chats.data[0]?.id}}, undefined, {shallow: true})
      setCurrentChatId(chats.data[0]?.id)
    }
    else {
      setChats(chatsRef.current)
    }
  }

  const editChatFolder = async (data: {chatFolderId: number, chatsIds: number[] }, name: string): Promise<boolean> => {
    await ChatRepository.moveChatToFolder(data)
    const folder = await ChatRepository.editChatFolderState({id: data.chatFolderId, name})
    setFolders(state=> {
      state.set(folder.id, folder)
      return new Map(state)
    })
    return true
  }
 
  const createChatFolder = async (name: string, chats: IChat[]):Promise<boolean> => {
    try{
      const res = await ChatRepository.createChatFolder({ name })
      await ChatRepository.moveChatToFolder( {chatFolderId: res.id, chatsIds: chats.map(c => c.id)})
      const folders = await ChatRepository.getChatFolders()
      setFolders(state=> {
        return new Map(folders.data.map(el=> [el.id, el]))
      })
      return true
    }
    catch(err) {
      
    }
  }

  const setComponent = (_pages: {component: ChatComponent, active: boolean}[]) => {
    setComponentState(state=> {
      if(isTabletWidth) {
        Object.values(ChatComponent).forEach(el=> state.set(el as ChatComponent, false))
      }
      _pages.forEach(el=> state.set(el.component, el.active))
      return new Map(state)
    })
  }

  const debouncedReconnect = debounce(async () => {
    const data = await ChatRepository.getChatList({})
    if(data.data) {
      setChats(new Map(data.data.map(el=> [el.id, el])) ?? new Map)
      setTotalChats(data.total)
    }
  }, 1000)

  useEffect(() => {
    isLoggedRef.current = isLogged
  }, [isLogged])

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if(!currentChatId){
        return
    }
    const subscription = chatSocket.messageState$.subscribe((message) => {
      if (chats.has(message.chatId)) {
        setChats(state => {
          const newState = [...state.values()].map(i => i.id === message.chatId ? {
            ...i,
            lastMessageAt: message.createdAt,
            lastMessage: message.message||'',
            totalUnread: message.chatId === currentChatId ? i.totalUnread : i.totalUnread + 1
          } : i)
          .sort(
            (objA, objB) => (new Date(objB.lastMessageAt)).getTime() - (new Date(objA.lastMessageAt)).getTime(),
          )
          return new Map(newState.map(el=> [el.id, el]))
        })
      } else if (page === 1) {
        loadChats(1)
      }
    })

    const subscriptionChatUpdate = chatSocket.chatUpdateState$.subscribe((chat) => {
      if (chats.has(chat.id)) {
        setChats(state => {
          const newState =[...state.values()].map(i => i.id === chat.id ? {
            ...i,
           ...chat
          } : i)
          .sort(
            (objA, objB) => (new Date(objB.lastMessageAt)).getTime() - (new Date(objA.lastMessageAt)).getTime(),
          )
          return new Map(newState.map(el=> [el.id, el]))
        })
      } else if (page === 1) {
        loadChats(1)
      }
    })
    return () => {
      subscription.unsubscribe()
      subscriptionChatUpdate.unsubscribe()
    }

  }, [chats, currentChatId])

  useEffect(() => {
    const subscription = chatSocket.reconnectState$.subscribe(async (val) => {
      debouncedReconnect()
    });
    [...chats.keys()].map(el=> {
      chatSocket.join(el)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [chats])

  useEffect(() => {
    if (!windowFocusInit.current) {
      windowFocusInit.current = true
      return
    }
    if (windowFocused) {
      debouncedReconnect()
    }
  }, [windowFocused])


  const value: IState = {
    currentChatId,
    setCurrentChatId,
    chats,
    totalChats,
    loading,
    fetchMore,
    decreaseUnreadCount,
    scrollableTarget,
    filter,
    setFilter,
    foldersActive,
    setFoldersActive,
    createChatFolder,
    folders,
    removeChatFolder,
    editChatFolder,
    setChatsFromFolder,
    chatsRef,
    component,
    setComponent,
    editChat,
    removeChat
  }

  return (
    <ChatContext.Provider value={value}>
      {props.children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  return useContext(ChatContext)
}

