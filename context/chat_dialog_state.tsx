import IChat, { IMessage } from 'data/interfaces/IChat'
import { RefObject, createContext, useContext, useEffect, useRef, useState } from 'react'
import { Nullable } from 'types/types'
import { useUserContext } from './user_state'
import { useChatContext } from './chat_state'
import {v4 as uuidv4} from 'uuid'

import ChatRepository from 'data/repositories/ChatRepository'
import { useChatSocketContext } from './chat_socket_state'
import debounce from 'debounce'
import FileRepository from 'data/repositories/FileRepository'
import { useAppContext } from './state'
import { SnackbarType } from 'types/enums'
import useWindowFocus from 'use-window-focus'

const chatIds: number[] = []
const markReadList: number[] = []

export interface IDialogState {
  chat: IChat | null,
  messages: Map<number|string, IMessage>

  totalMessages: number
  fetchMore: () => void
  loading: boolean
  sendMessage: (data: IMessage, files?: {pastedImages?:File[], voiceMessage?: File}) => void
  markRead: (messageId: number) => void
  markReadMulti: (messageIds: number[]) => void,
  scrollableTarget: RefObject<HTMLElement> | null
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
  const {showSnackbar} = useAppContext()
  const userContext = useUserContext()
  const chatContext = useChatContext()
  const chatSocket = useChatSocketContext()
  
  const [chatId, setChatId] = useState<IChat | null>(props.chat ?? null)
  const [chat, setChat] = useState<IChat | null>(props.chat ?? null)
  const [page, setPage] = useState<number>(1)
  const [totalMessages, setTotalMessages] = useState<number>(100000000)
  const [messages, setMessages] = useState<Map<number|string, IMessage>>(new Map)
  const [loading, setLoading] = useState(true)
  
  const scrollableTarget = useRef<HTMLElement | null>(null)
  const chatIdRef = useRef<number | null>(null)
  const chatRef = useRef<Nullable<IChat>>(null)
  const messagesRef = useRef<IMessage[]>([])
  const reconnectRef = useRef<boolean>(false)
  const windowFocusInit = useRef(false)
  
  const profileType = userContext.currentProfile?.profileType
  const windowFocused = useWindowFocus()
  const limit = 30

  const processLoadedMessages = (data: IMessage[], total: number | null) => {
    if (total === 0) {
      setTotalMessages(messages.size)
    }
    // const readIds: number[] = (data ?? []).filter(i => i.id && i.userStates?.some(i => !i.read)).map(i => i.id!)
    // if (readIds.length > 0) {
    //   chatContext.decreaseUnreadCount(props.chatId!, readIds.length)
    //   markReadMulti(readIds)
    // }
    
    setMessages(state => {
      data.forEach(el=> {
        state.set(el.id, el)
      })
      return new Map(state)
    })
  }

  const loadMessages = async (lastCreatedAt?: string) => {
    setLoading(true)
    const data = await ChatRepository.getMessagesByChatId(profileType, props.chatId, lastCreatedAt, limit )
    setLoading(false)
    processLoadedMessages(data.data, data.total)
  }

  const init = async () => {
    loadMessages()
  }

  const fetchMore = async () => {
    if (!props.chatId) {
      return
    }
    await loadMessages([...messages.values()][messages.size - 1]?.createdAt)
    setPage(page + 1)
  }


  const debouncedReconnect = debounce(async () => {
    if (!reconnectRef.current) {
      return
    }
    // if(receivingPointIdRef.current){
    //   chatSocket.joinReceivingPointId(receivingPointIdRef.current!)
    // }
    if(chatIdRef.current){
      chatSocket.join(chatIdRef.current!)
    }

    if(chatIdRef.current){
      const data = await ChatRepository.getMessagesByChatId(profileType, props.chatId!, null, limit)

      if (!reconnectRef.current) {
        return
      }
      const lastIds = data.data.map(i => i.id)
      const currentIds = messagesRef.current.map(i => i.id)
      const existsIds = currentIds.filter(i => lastIds.includes(i))
      const newIds = lastIds.filter(i => !existsIds.includes(i))
      
      // if (newIds.length > 0) {
      //   setMessages(state => (new Map([[i.id, i], ...state.entries()])))
      //   debouncedScroll()
      // }
    }

  }, 1000)

  const debouncedScroll = debounce(async () => {
    if (!scrollableTarget?.current) {
      return
    }
    scrollableTarget?.current?.scroll({
      top: scrollableTarget?.current?.scrollHeight,
      behavior: 'smooth',
    })
  }, 500)

  const debouncedMarkRead = debounce(async () => {
      try {
        await ChatRepository.setReadIds(profileType, markReadList)
        markReadList.length = 0
      } catch (e) {
        console.error('ErrorMarkRead', e)
      }
  }, 500)


  /** создаём сообщение, которое видно сразу, но еще не загруженное */
  const createDumbMessage = (data: IMessage, files: {pastedImages?:File[], voiceMessage?: File}, sid: string) => {
    const dumbMessage = {
      ...data as IMessage,
      sid,
      id: sid,
      profileId: userContext.currentProfile.id,
      createdAt: (new Date()).toISOString(),
    }
    if(files && (files.pastedImages||files.voiceMessage)) {
      files.pastedImages&&(dumbMessage.pastedImages = files.pastedImages)
      files.voiceMessage&&(dumbMessage.voiceMessage = files.voiceMessage)
    }

    setMessages(state => {
      return new Map([[sid, dumbMessage], ...state.entries()])
    })
  }

  /** отправка текста, изображений и аудио */
  const sendMessage = async (data: IMessage, files: {pastedImages?:File[], voiceMessage?: File}) => {
    const sid = uuidv4()
    setTotalMessages(i => i + 1)
    createDumbMessage(data, files, sid)
    
    if(files && files?.pastedImages&&files?.pastedImages.length > 0) {
      try{
        const downloadedImages = await Promise.all(files.pastedImages?.map(el=> FileRepository.uploadFile(el)))
        data.assetsIds = downloadedImages.map(el=> Number(el.id))
      } 
      catch(err) {
        showSnackbar('Не удалось загрузить изображения', SnackbarType.error)
      }
    }

    else if(files?.voiceMessage) {
      try{
        const voiceId = await FileRepository.uploadFile(files.voiceMessage)
        data.assetsIds = [Number(voiceId.id)]
      }
      catch(err) {
        showSnackbar('Не удалось загрузить голосовое сообщение', SnackbarType.error)
      }
    }
 
    const createdMessage = await ChatRepository.createMessage(profileType, {...data, chatId: chat.id, sid, profileId: userContext.currentProfile.id})
    setMessages(state=> {
      state.delete(sid)
      return new Map([[createdMessage.id, createdMessage], ...state.entries()])
    })
  }

  /** помечаем сообщения как прочитанные */
  const markRead = (messageId: number) => {
    markReadList.push(messageId)
    debouncedMarkRead()
  }

  useEffect(() => {
    chatIdRef.current = props.chatId ?? null
    init()

    if(messages.size > 0) {
      setMessages(state => {
        state.clear()
        return new Map(state)
      })
      setTotalMessages(1000000)
    }
    
    if (props.chatId||props.chat) {
      chatContext.setCurrentChatId(props.chatId||props.chat.id)
      chatSocket.join(props.chat.id||props.chatId)
    }

    return () => {
      if (props.chat||props.chatId) {
        chatSocket.leave(props.chat.id||props.chatId)
      }
    }
  }, [props.chatId, props.chat])

  useEffect(() => {

    const subscription = chatSocket.messageState$.subscribe((message) => {
      if (chat && message.chatId === chat.id && !messages.has(message.id)) {
        markRead(Number(message.id))
        if (message.sid && messages.has(message.sid)) {
          // setMessages(state => i.map(i => i.sid === message.sid ? {...i, ...message} : i))
        } else {
          setMessages(state => new Map([[message.id, message], ...state.entries()]))
          setTotalMessages(i => i + 1)
        }
        if ((scrollableTarget.current?.scrollTop ?? 0) < 50) {
          debouncedScroll()
        }
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

  useEffect(() => {
    if (!chatIdRef?.current) {
      return
    }
    if (!windowFocusInit.current) {
      windowFocusInit.current = true
      return
    }
    if (windowFocused) {
      reconnectRef.current = true
      debouncedReconnect()
    }
  }, [windowFocused])

  const value: Partial<IDialogState> = {
    chat,
    messages,
    sendMessage,
    loading,
    fetchMore,
    totalMessages,
    scrollableTarget
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
