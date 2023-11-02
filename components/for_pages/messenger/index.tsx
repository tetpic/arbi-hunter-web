import styles from './index.module.scss'

import IChat from 'data/interfaces/IChat'
import Chats from './Chats'
import { useRouter } from 'next/router'
import { ChatDialogWrapper } from 'context/chat_dialog_state'
import { useChatContext } from 'context/chat_state'
import { useEffect, useState } from 'react'
import { useResize } from 'components/hooks/useResize'
import dynamic from 'next/dynamic'

const FolderManager = dynamic(()=>import('./FolderManager'), {ssr: false})
const Messages = dynamic(()=>import('./Messages'), {ssr: false})


interface Props {
}

enum ChatComponent {
  Dialog,
  Chat
}

export default function Messenger(props: Props) {
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

  return (
    <div className={styles.root}> 
      {((isTabletWidth && component === ChatComponent.Chat) || !isTabletWidth) &&
        <Chats chats={chats} chatId={chatContext.currentChatId} onSelect={handleSelectChat} />
      }
      <ChatDialogWrapper chatId={chatContext.currentChatId||chats[0]?.id} chat={chats.find(c=> c.id === chatContext.currentChatId)||chats[0]}>
        {chatContext.foldersActive&& ((isTabletWidth && component === ChatComponent.Dialog) || !isTabletWidth) &&
          <FolderManager/>
          ||
        !chatContext.foldersActive && ((isTabletWidth && component === ChatComponent.Dialog) || !isTabletWidth) &&
          <Messages onBackClick={()=>setComponent(ChatComponent.Chat)}/>
        }
      </ChatDialogWrapper>
    </div>
  )
}