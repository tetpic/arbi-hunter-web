import IChat, { IMessage } from 'data/interfaces/IChat'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Nullable } from 'types/types'
import { useUserContext } from './user_state'
import { useChatContext } from './chat_state'
import {v4 as uuidv4} from 'uuid'

import ChatRepository from 'data/repositories/ChatRepository'
import { useChatSocketContext } from './chat_socket_state'


export interface IDialogState {
  chat: IChat | null,
  messages: Map<number|string, IMessage>
  totalMessages: number
  fetchMore: () => void
  loading: boolean
  sendMessage: (data: IMessage) => void
  markRead: (messageId: number) => void
  markReadMulti: (messageIds: number[]) => void,
  // scrollableTarget: RefObject<HTMLElement> | null
  isDisabledByOtherManager: boolean
  disabledType: Nullable<any>,
  disabled: boolean
}

const defaultValue: Partial<IDialogState> = {}

const ChatDialogContext = createContext<Partial<IDialogState>>(defaultValue)

interface Props {
  chat?: IChat
  chatId?: number | null
  children: React.ReactNode
}

export function ChatDialogWrapper(props: Props) {
  const userContext = useUserContext()
  const chatContext = useChatContext()
  const chatSocket = useChatSocketContext()
  const profileType = userContext.currentProfile?.profileType
  const [chatId, setChatId] = useState<IChat | null>(props.chat ?? null)
  const [chat, setChat] = useState<IChat | null>(props.chat ?? null)

  const chatIdRef = useRef<number | null>(null)



  const [messages, setMessages] = useState<Map<number|string, IMessage>>(new Map)

  const [totalMessages, setTotalMessages] = useState<number>(100000000)
  const [page, setPage] = useState<number>(1)
  const chatRef = useRef<Nullable<IChat>>(null)
  const reconnectRef = useRef<boolean>(false)
  const [loading, setLoading] = useState(true)
  const limit = 30

 


  const init = async () => {
    loadMessages()
  }

  const processLoadedMessages = (data: IMessage[], total: number | null, fromInit: boolean = false) => {
    if (total === 0) {
      setTotalMessages(messages.size)
    }
    // const readIds: number[] = (data ?? []).filter(i => i.id && i.userStates?.some(i => !i.read)).map(i => i.id!)
    // if (readIds.length > 0) {
    //   chatContext.decreaseUnreadCount(props.chatId!, readIds.length)
    //   markReadMulti(readIds)
    // }
    
    setMessages(state => {
      state.clear()
      data.forEach(el=> {
        state.set(el.id, el)
      })
      return new Map(state)
    })
  }



  const loadMessages = async (lastCreatedAt?: string) => {
    const data = await ChatRepository.getMessagesByChatId(profileType, props.chatId, lastCreatedAt, limit )
    processLoadedMessages(data.data, data.total)
  }

  const fetchMore = async () => {
    if (!props.chatId) {
      return
    }
    await loadMessages([...messages.values()][messages.size - 1]?.createdAt)
    setPage(page + 1)
  }

  const sendMessage = async (data: IMessage) => {
    const sid = uuidv4()
    
    setTotalMessages(i => i + 1)
    const messageToCreate = {
      ...data as IMessage,
      sid,
      id: 0,
      userId: userContext.currentProfile.id,
      createdAt: (new Date()).toISOString(),
    }
    setMessages(state => {
      return new Map([[sid, messageToCreate], ...state.entries()])
    })
    ChatRepository.createMessage(profileType, {...data, chatId: chat.id, sid, userId: userContext.currentProfile.id})

    // if ((props.receivingPointId && props.sellerId) && !chat?.id) {
    //   const chat = await ChatRepository.createChat({
    //     receivingPointId: props.receivingPointId,
    //     sellerId: props.sellerId
    //   })
    //   setChat(chat)

    //   ChatRepository.createMessage(profileType, {...data, chatId: chat!.id, sid, userId: })
    // } else {
    //   ChatRepository.createMessage(profileType, {...data, chatId: chat!.id, sid, userId: appContext.aboutMe?.id})
    // }

  }
  // useEffect(() => {
  //   init()

  // }, [props.chatId])

  useEffect(() => {
    chatIdRef.current = props.chatId ?? null
    if (props.chatId||props.chat) {
      chatContext.setCurrentChatId(props.chatId||props.chat.id)
    }
    init()
  }, [props.chatId])

  useEffect(() => {
    const subscription = chatSocket.messageState$.subscribe((message) => {
      if (chat && message.chatId === chat.id && !messages.has(message.id)) {
        // markRead(message.id!)

        if (message.sid && messages.has(message.sid)) {
          // setMessages(state => i.map(i => i.sid === message.sid ? {...i, ...message} : i))
        } else {
          setMessages(state => new Map([[message.id, message], ...state.entries()]))
          setTotalMessages(i => i + 1)
        }
        // if (message.userId === appContext.aboutMe!.id || (scrollableTarget.current?.scrollTop ?? 0) < 50) {
          // debouncedScroll()
        // }


      }
    })

    const subscriptionChatUpdate = chatSocket.chatUpdateState$.subscribe((updated) => {
      if (chat && chat.id === updated.id) {
        setChat((i) => ({...i,...updated}))
      }
    })
    const subscriptionChatCreated = chatSocket.chatCreateState$.subscribe((created) => {
      if (!chat) {
        init()
      }
    })
    return () => {
      subscription.unsubscribe()
      subscriptionChatUpdate.unsubscribe()
      subscriptionChatCreated.unsubscribe()
    }
  }, [chat, messages])










  const value: Partial<IDialogState> = {
    ...defaultValue,
    chat,
    messages,
    sendMessage
  
  }

  return (
    <ChatDialogContext.Provider value={value}>
      {props.children}
    </ChatDialogContext.Provider>
  )
}

export function useChatDialogContext() {
  return useContext(ChatDialogContext)
}
