import styles from './index.module.scss'

import IChat from 'data/interfaces/IChat'
import Chats from './Chats'
import { useRouter } from 'next/router'
import { ChatDialogWrapper } from 'context/chat_dialog_state'
import { useChatContext } from 'context/chat_state'
import { useEffect, useState } from 'react'
import { useResize } from 'components/hooks/useResize'
import dynamic from 'next/dynamic'
import { useAppContext } from 'context/state'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'

const FolderManager = dynamic(()=>import('./FolderManager'), {ssr: false})
const Messages = dynamic(()=>import('./Messages'), {ssr: false})

enum ChatComponent {
  Dialog,
  Chat
}

export default function Messenger() {
  const appContext = useAppContext()
  const router = useRouter()
  const chatContext = useChatContext()
  const chats = chatContext.chats
  const {isTabletWidth} = useResize()
  const [component, setComponent] = useState<ChatComponent>(ChatComponent.Chat)

  const handleSelectChat = (chat: IChat) => {
    chatContext.setCurrentChatId(chat.id)
    setComponent(ChatComponent.Dialog)
    router.replace({query: { ...router.query, chat: chat.id}}, undefined, {shallow: true})
  }

  useEffect(()=>{
    chatContext.foldersActive
    ? setComponent(ChatComponent.Dialog)
    : setComponent(ChatComponent.Chat)
  }, [chatContext.foldersActive])

  useEffect(()=>{
    if(isTabletWidth) {
      appContext.setHideHeader(true)
    }
    return (()=> {
      appContext.setHideHeader(false)
    })
  }, [isTabletWidth])

  return (
    <div className={styles.root}> 
      {((isTabletWidth && component === ChatComponent.Chat) || !isTabletWidth) && 
        <Chats chats={[...chats.values()]} chatId={chatContext.currentChatId} onSelect={handleSelectChat} />
      }
      <ChatDialogWrapper chatId={chatContext.currentChatId||[...chats.values()][0]?.id} chat={chats.get(chatContext.currentChatId)||[...chats.values()][0]}>
        {chatContext.foldersActive&& ((isTabletWidth && component === ChatComponent.Dialog) || !isTabletWidth) && !chatContext.loading &&
          <FolderManager/>
          ||
        !chatContext.foldersActive && ((isTabletWidth && component === ChatComponent.Dialog) || !isTabletWidth) && !chatContext.loading && chatContext.chats.size > 0 &&
          <Messages onBackClick={()=>setComponent(ChatComponent.Chat)}/>
          ||
        chatContext.loading &&
          <Spinner size={32} color={colors.blue}/>
        }
      </ChatDialogWrapper>
    </div>
  )
}