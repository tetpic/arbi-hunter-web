import IChat from 'data/interfaces/IChat'
import Chats from './Chats'
import Messages from './Messages'
import styles from './index.module.scss'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { ChatDialogWrapper } from 'context/chat_dialog_state'

interface Props {
  chats: IChat[]
}

export default function Messenger(props: Props) {
  const router = useRouter()
  const [chatId, setChatId] = useState<number | null>(router.query.chat ? parseInt(router.query.chat as string, 10) : null)

  const handleSelectChat = (chat: IChat) => {
    setChatId(chat.id)
    router.replace({query: { ...router.query, chat: chat.id}}, undefined, {shallow: true})
  }

  return (
    <div className={styles.root}> 
      <Chats chats={props.chats} chatId={chatId} onSelect={handleSelectChat} />
      <ChatDialogWrapper chatId={chatId||props.chats[0].id} chat={props.chats.find(c=> c.id === chatId)||props.chats[0]}>
        <Messages/>
      </ChatDialogWrapper>
    </div>
  )
}