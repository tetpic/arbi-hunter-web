import styles from './index.module.scss'

import ItemNavigation from 'components/for_pages/profile/ItemNavigation'
import ChatSearchBar from './ChatSearchBar'
import {useEffect, useState } from 'react'
import ChatItem from './ChatItem'
import IChat from 'data/interfaces/IChat'
import { useChatContext } from 'context/chat_state'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'

interface Props {
  chats: IChat[]
  chatId: number | null
  onSelect: (chat: IChat) => void
}

export default function Chats(props: Props) {
  
  const [page, pager] = useState<string>('__all__')
  const chatContext = useChatContext()
  const folders = [...chatContext.folders.values()]

  const itemsNav = [
    //__all__ если кому-то взбредет назвать папку all
    {name: 'Все чаты', type: '__all__'},
    ...folders?.map(el=> {return {name: el.name, type: el.name}})
  ]

  useEffect(()=>{
    chatContext.setChatsFromFolder(page)
  }, [page])
  

  return (<>
    <div className={styles.root} > 
      <ChatSearchBar/>
      <div className={styles.navWrapper}>
        <ItemNavigation bottomStringClass={styles.navBottom} pClassName={styles.navP} className={styles.nav}  activeItem={page} items={itemsNav} onClick={pager}/>
      </div>
      <div className={styles.chats}>
        {
          !chatContext.loading && props.chats.length > 0&& props.chats.map((chat)=> {
            return (
              <ChatItem chat={chat} onClick={() => props.onSelect(chat)} isActive={chatContext.currentChatId === chat.id} />
            )
          })
          ||
          props.chats.length === 0 && chatContext.filter &&
          <p className='empty'>Чатов не найдено</p>
          ||
          <Spinner size={32} color={colors.yellow}/>
        }
      </div>
    </div>
    
  </>)
}