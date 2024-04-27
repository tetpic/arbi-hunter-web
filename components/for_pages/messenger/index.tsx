import styles from './index.module.scss'

import IChat from 'data/interfaces/IChat'
import Chats from './Chats'
import { useRouter } from 'next/router'
import { ChatDialogWrapper } from 'context/chat_dialog_state'
import { ChatComponent, useChatContext } from 'context/chat_state'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAppContext } from 'context/state'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'

const FolderManager = dynamic(()=>import('./FolderManager'), {ssr: false})
const Messages = dynamic(()=>import('./Messages'), {ssr: false})



interface Props {
  chat?: number
}

export default function Messenger(props: Props) {
  const appContext = useAppContext()
  const router = useRouter()
  const chatContext = useChatContext()
  const chats = chatContext.chats
  const {isTabletWidth} = appContext.size

  const handleSelectChat = (chat: IChat) => {
    chatContext.setCurrentChatId(chat.id)
    chatContext.setComponent([{component: ChatComponent.Dialog, active: true}])
    router.replace({query: { ...router.query, chat: chat.id}}, undefined, {shallow: true})
  }

  useEffect(()=>{
    if(isTabletWidth) {
      appContext.setHideHeader(true)
      if(props.chat) {
        chatContext.setComponent([{component: ChatComponent.Dialog, active: true}])
      }
    }
    return (()=> {
      appContext.setHideHeader(false)
    })
  }, [isTabletWidth])

  return (
    <div className={styles.root}> 
      {chatContext.component.get(ChatComponent.Chat) && 
        <Chats chats={[...chats.values()]} chatId={chatContext.currentChatId} onSelect={handleSelectChat} />
      }
      <ChatDialogWrapper chatId={chatContext.currentChatId||[...chats.values()][0]?.id} chat={chats.get(chatContext.currentChatId)||[...chats.values()][0]}>
        {chatContext.component.get(ChatComponent.Folder) && !chatContext.loading &&
          <FolderManager/>
          ||
        chatContext.component.get(ChatComponent.Dialog)  && !chatContext.loading && chatContext.chats.size > 0 &&
          <Messages onBackClick={()=>chatContext.setComponent([{component: ChatComponent.Chat, active: true}, {component: ChatComponent.Folder, active: false}])}/>
          ||
        chatContext.loading &&
          <Spinner size={32} color={colors.blue}/>
        }
      </ChatDialogWrapper>
    </div>
  )
}