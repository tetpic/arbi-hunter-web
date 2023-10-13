import { IChat } from 'data/interfaces/Common'
import Chats from './Chats'
import Messages from './Messages'
import styles from './index.module.scss'
import { useState } from 'react'

interface Props {
  chats: IChat[]
}

export default function Messenger(props: Props) {
  const [currentChat, setCurrentChat] = useState<IChat>(props.chats[0])


  return (<div className={styles.root}> 
    <Chats chats={props.chats} currentChat={currentChat} onClick={(chat: IChat) => setCurrentChat(chat)}/>
    <Messages currentChat={currentChat}/>
  

  </div>)
}