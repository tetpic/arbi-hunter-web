import {createContext, MutableRefObject, RefObject, useContext, useEffect, useRef, useState} from 'react'
import IChat, { IChatFolder, IChatListRequest } from 'data/interfaces/IChat'
import ChatRepository from 'data/repositories/ChatRepository'
import {debounce} from 'debounce'
import {useChatSocketContext} from 'context/chat_socket_state'
import useWindowFocus from 'use-window-focus'
import { useUserContext } from './user_state'
import { IDialogState } from './chat_dialog_state'
import { useRouter } from 'next/router'

interface IChatFilter extends IChatListRequest{
}

interface IState {
  chats: IChat[]
  currentChatId: number | null,
  totalChats: number
  fetchMore: () => void
  loading: boolean
  filter: IChatFilter
  filterIsEmpty: boolean,
  setFilter: (filter: IChatFilter) => void,
  decreaseUnreadCount: (chatId: number, total: number) => void
  setCurrentChatId: (chatId: number | null) => void,
  scrollableTarget: RefObject<HTMLElement> | null
  currentDialogContext: MutableRefObject<Partial<IDialogState>>
  foldersActive: boolean
  setFoldersActive: ()=>void
  folders: Map<number, IChatFolder>
  createChatFolder: (name: string, chats: IChat[]) => Promise<boolean>
  editChatFolder: (data: {chatFolderId: number, chatsIds: number[] }, name: string) => Promise<boolean>
  removeChatFolder: (id: number) => Promise<boolean> 
  setChatsFromFolder: (name: string) => void

}

const defaultValue: Partial<IState> = {}

const ChatContext = createContext<Partial<IState>>(defaultValue)

interface Props {
  children: React.ReactNode
  chats?: IChat[]
  folders?: IChatFolder[]
}

export function ChatWrapper(props: Props) {
  const userContext = useUserContext()
  const profileType = userContext.currentProfile.profileType
  const isLogged = userContext.isLogged
  const router = useRouter()

  const chatSocket = useChatSocketContext()
  const abortControllerRef = useRef<AbortController | null>(null)
  const windowFocused = useWindowFocus()
  const isLoggedRef = useRef<boolean>(isLogged)
  const scrollableTarget = useRef<HTMLElement | null>(null)
  const [chats, setChats] = useState<IChat[]>(props.chats)
  const [currentChatId, setCurrentChatId] = useState<number | null>(0)
  const [totalChats, setTotalChats] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [foldersActive, setFoldersActiveState] = useState<boolean>(false)
  const [folders, setFolders] = useState<Map<number, any>>(new Map)

  const limit = 30
  const [filter, setFilterState] = useState<IChatFilter>({page: 1, limit: limit ?? 30})
  const filterRef = useRef<IChatFilter>(filter)
  const windowFocusInit = useRef(false)

  const getFilterChatListRequest = (): IChatListRequest => {
    return {
      ...(filterRef.current?.search ? {search: filterRef.current.search} : {}),
      ...(filterRef.current?.userId ? {receivingPointId: filterRef.current.userId}: {}),
    }
  }

  const init = async () => {
    await loadChats(1)
    setLoading(false)
  }

  const loadChats = async (page: number) => {
    if (abortControllerRef.current) {
      abortControllerRef.current?.abort()
    }
    abortControllerRef.current = new AbortController()
    try {
      const data = await ChatRepository.getChatList({}, profileType, null, {signal: abortControllerRef.current?.signal!})
      abortControllerRef.current = null
      if (page === 1) {
        setChats(data.data)
      } else {
        setChats(i => [...i, ...data.data])
      }
      setTotalChats(data.total)
    } catch (e) {
      return
    }
  }

  const fetchMore = async () => {
    await loadChats(page + 1)
    setPage(page + 1)
  }

  const setFilter = (data: IChatFilter) => {
    filterRef.current = data
    setFilterState(data)
    loadChats(1)
  }

  const decreaseUnreadCount = (chatId: number, total: number)=> {
    setChats(i => i.map(i => i.id === chatId ? {
      ...i,
      totalUnread: i.totalUnread - total < 0 ? 0 : i.totalUnread - total
    } : i))
  }

  const setFoldersActive = () => {
    setFoldersActiveState(!foldersActive)
  }

  const removeChatFolder = async (id: number): Promise<boolean> => {
    await ChatRepository.deleteChatFolder(profileType, id)
    setFolders(state => {
      state.delete(id)
      return new Map(state)
    })
    return true
  }

  const setChatsFromFolder = async (chatName: string) => {
    const folderToSet = [...folders.values()].find(el => el.name === chatName)||null
    if(folderToSet) {
      const chats = await ChatRepository.getChatList({chatFolderId: folderToSet.id}, profileType)
      setChats(chats.data)
      router.replace({query: { ...router.query, chat: chats.data[0]?.id}}, undefined, {shallow: true})
      setCurrentChatId(chats.data[0]?.id)
    }
    else {
      setChats(props.chats)
    }
  }

  const editChatFolder = async (data: {chatFolderId: number, chatsIds: number[] }, name: string): Promise<boolean> => {
    await ChatRepository.moveChatToFolder(profileType, data)
    const folder = await ChatRepository.editChatFolderState(profileType, {id: data.chatFolderId, name})
    setFolders(state=> {
      state.set(folder.id, folder)
      return new Map(state)
    })
    return true
  }
 
  const createChatFolder = async (name: string, chats: IChat[]):Promise<boolean> => {
    try{
      const res = await ChatRepository.createChatFolder(profileType, { name })
      await ChatRepository.moveChatToFolder(profileType, {chatFolderId: res.id, chatsIds: chats.map(c => c.id)})
      const folders = await ChatRepository.getChatFolders(profileType)
      setFolders(state=> {
        return new Map(folders.data.map(el=> [el.id, el]))
      })
      return true
    }
    catch(err) {
      console.error(err)
    }
  }

  const debouncedReconnect = debounce(async () => {
    const data = await ChatRepository.getChatList({}, profileType)
    setChats(data.data ?? [])
    setTotalChats(data.total)
  }, 1000)

  useEffect(() => {
    isLoggedRef.current = isLogged
  }, [isLogged])

  useEffect(() => {
    filterRef.current = filter
  }, [filter])

  useEffect(() => {
    init()
  }, [])

  useEffect(()=>{
    
    setFolders(_=> {
      return new Map(props.folders.map(f=> [f.id, f]))
    })
  }, [props.folders])

  useEffect(() => {
    if(!currentChatId){
        return
    }
    const subscription = chatSocket.messageAllState$.subscribe((message) => {
      if (chats.find(i => i.id === message.chatId)) {
        setChats(i => i.map(i => i.id === message.chatId ? {
          ...i,
          lastMessageAt: message.createdAt,
          lastMessage: message.message ?? '',
          totalUnread: message.chatId === currentChatId ? i.totalUnread : i.totalUnread + 1
        } : i)
          .sort(
            (objA, objB) => (new Date(objB.lastMessageAt)).getTime() - (new Date(objA.lastMessageAt)).getTime(),
          ))
      } else if (page === 1) {
        loadChats(1)
      }
    })

    const subscriptionChatUpdate = chatSocket.chatUpdateState$.subscribe((chat) => {
      
      if (chats.find(i => i.id === chat.id)) {
        setChats(i => i.map(i => i.id === chat.id ? {
          ...i,
         ...chat
        } : i)
          .sort(
            (objA, objB) => (new Date(objB.lastMessageAt)).getTime() - (new Date(objA.lastMessageAt)).getTime(),
          ))
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

  const value: Partial<IState> = {
    ...defaultValue,
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
    setChatsFromFolder
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

