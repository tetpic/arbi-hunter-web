import ItemNavigation from 'components/for_pages/profile/ItemNavigation'
import ChatSearchBar from './ChatSearchBar'
import {useState } from 'react'
import ChatItem from './ChatItem'
import styles from './index.module.scss'
import IChat from 'data/interfaces/IChat'
import { useChatContext } from 'context/chat_state'

interface Props {
  chats: IChat[]
  chatId: number | null
  onSelect: (chat: IChat) => void
}

enum ChatNav {
  AllChats = 'allChats',
  HighSalary = 'highSalary',
  Remote = 'remote'
}

export default function Chats(props: Props) {
  const [page, pager] = useState<ChatNav>(ChatNav.AllChats)
  const chatContext = useChatContext()

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

  return (<>
    <div className={styles.root} > 
      <ChatSearchBar/>
      <div className={styles.navWrapper}>
        <ItemNavigation bottomStringClass={styles.navBottom} pClassName={styles.navP} className={styles.nav}  activeItem={page} items={itemsNav} onClick={pager}/>
      </div>
      <div className={styles.chats}>
        {
          props.chats.map((chat)=> {
            return (
              <ChatItem chat={chat} onClick={() => props.onSelect(chat)} isActive={chatContext.currentChatId === chat.id} />
            )
          })
        }
      </div>
    </div>
    
  </>)
}