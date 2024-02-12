import styles from './index.module.scss'

import ChatSearchBar from './ChatSearchBar'
import {useEffect, useRef, useState } from 'react'
import ChatItem from './ChatItem'
import IChat from 'data/interfaces/IChat'
import { useChatContext } from 'context/chat_state'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import ItemNavigation from '@/components/ui/ItemNavigation'

interface Props {
  chats: IChat[]
  chatId: number | null
  onSelect: (chat: IChat) => void
}

export default function Chats(props: Props) {
  const chatsRef = useRef<HTMLDivElement>(null!)
  const [page, pager] = useState<string>('__all__')
  const chatContext = useChatContext()
  const folders = [...chatContext.folders.values()]
  const [initialPos,   setInitialPos] = useState(null)
  const [initialSize, setInitialSize] = useState(null)

  const itemsNav = [
    //__all__ если кому-то взбредет назвать папку all
    {name: 'Все чаты', type: '__all__'},
    ...folders?.map(el=> {return {name: el.name, type: el.name}})
  ]

  useEffect(()=>{
    chatContext.setChatsFromFolder(page)
  }, [page])


  
  const initial = (e: React.DragEvent<HTMLDivElement>) => {
    setInitialPos(e.clientX)
    setInitialSize(chatsRef.current.offsetWidth)
  }
    
  const resize = (e: React.DragEvent<HTMLDivElement>) => {
    chatsRef.current.style.width = `${parseInt(initialSize) + (e.clientX - initialPos)}px`
  }

  return (
    <div className={styles.root} ref={chatsRef}> 
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
          // props.chats.length === 0 && !chatContext.loading &&
          // <p className='empty'>Чатов не найдено</p>
          // ||
          <Spinner size={32} color={colors.yellow}/>
        }
      </div>
      <div className={styles.draggable} draggable={true} onDragStart={initial} onDrag={(e)=> resize(e)}></div>
    </div>
  )
}