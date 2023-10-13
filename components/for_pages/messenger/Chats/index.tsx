import ItemNavigation from 'components/for_pages/profile/ItemNavigation'
import ChatSearchBar from './ChatSearchBar'
import {useState } from 'react'
import styles from './index.module.scss'
import { IChat } from 'data/interfaces/Common'
import ChatItem from './ChatItem'

interface Props {
  chats: IChat[]
  onClick: (c: IChat) => void
  currentChat: IChat
}

enum ChatNav {
  AllChats = 'allChats',
  HighSalary = 'highSalary',
  Remote = 'remote'
}



export default function Chats(props: Props) {
  const [page, pager] = useState<ChatNav>(ChatNav.AllChats)

  const itemsNav = Object.values(ChatNav).map(el=> {
    switch (el) {
      case ChatNav.AllChats :
        return {name: 'Все чаты', type: el}
      case ChatNav.HighSalary: 
        return {name: 'Высокая зп', type: el}
      case ChatNav.Remote:
        return {name: 'Удалёнка', type: el}
    }
  })

  

  return (
    <div className={styles.root} > 
      <ChatSearchBar/>
      <div className={styles.navWrapper}>
        <ItemNavigation bottomStringClass={styles.navBottom} pClassName={styles.navP} className={styles.nav}  activeItem={page} items={itemsNav} onClick={pager}/>
      </div>
      {
        props.chats.map(chat=> {
          return <ChatItem current={props.currentChat.id === chat.id} chat={chat} onClick={props.onClick}/>
        })
      }
    </div>
  )
}