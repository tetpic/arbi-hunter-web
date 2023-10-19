import IChat from 'data/interfaces/IChat'
import Chats from './Chats'
import Messages from './Messages'
import styles from './index.module.scss'
import { useRouter } from 'next/router'
import { ChatDialogWrapper } from 'context/chat_dialog_state'
import FolderManager from './FolderManager'
import { useChatContext } from 'context/chat_state'

interface Props {
}

export default function Messenger(props: Props) {
  const chatContext = useChatContext()
  const chats = chatContext.chats
  const router = useRouter()

  const handleSelectChat = (chat: IChat) => {
    chatContext.setCurrentChatId(chat.id)
    router.replace({query: { ...router.query, chat: chat.id}}, undefined, {shallow: true})
  }

  return (
    <div className={styles.root}> 
      <Chats chats={chats} chatId={chatContext.currentChatId} onSelect={handleSelectChat} />
      <ChatDialogWrapper chatId={chatContext.currentChatId||chats[0].id} chat={chats.find(c=> c.id === chatContext.currentChatId)||chats[0]}>
        {chatContext.foldersActive&&
          <FolderManager/>
          ||
          <Messages/>
        }
      </ChatDialogWrapper>
    </div>
  )
}