import styles from './index.module.scss'

import ChatSearchBar from './ChatSearchBar'
import {useEffect, useRef, useState } from 'react'
import ChatItem from './ChatItem'
import IChat from 'data/interfaces/IChat'
import { useChatContext } from 'context/chat_state'
import ItemNavigation from '@/components/ui/ItemNavigation'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'
import { useAppContext } from 'context/state'
import MobileBottomMenu from '@/components/ui/MobileBottomMenu'

interface Props {
  chats: IChat[]
  chatId: number | null
  onSelect: (chat: IChat) => void
}

export default function Chats(props: Props) {
  const {t} = useTranslation()
  const chatsRef = useRef<HTMLDivElement>(null!)
  const [page, pager] = useState<string>('__all__')
  const chatContext = useChatContext()
  const folders = [...chatContext.folders.values()]
  const [initialPos,   setInitialPos] = useState(null)
  const [initialSize, setInitialSize] = useState(null)
  const appContext = useAppContext()
  const isTabletWidth = appContext.size.isTabletWidth

  const itemsNav = [
    //__all__ если кому-то взбредет назвать папку all
    {name: t('chat_allChats'), type: '__all__'},
    ...folders?.map(el=> {return {name: el.name, type: el.name}})
  ]

  useEffect(()=>{
    if(!chatContext.loading) {
      chatContext.setChatsFromFolder(page)
    }
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
      <ChatSearchBar onSearch={(s) => chatContext.setSearch(s)}/>
      <div className={styles.navWrapper}>
        <ItemNavigation bottomStringClass={styles.navBottom} pClassName={styles.navP} className={styles.nav}  activeItem={page} items={itemsNav} onClick={pager}/>
      </div>
      <div className={styles.chats}>
        {
          props.chats.length > 0
          && [
            ...props.chats.filter(el => el.profiles?.[0]?.pinned), 
            ... props.chats.filter(el => !el.profiles?.[0]?.pinned)
            ].map((chat)=> {
            return (
              <ChatItem key={chat.id} chat={chat} onClick={() => props.onSelect(chat)} isActive={chatContext.currentChatId === chat.id} />
            )
          })
          ||
          chatContext.totalChats === 0 &&
          <P styleType={['medium', 'w500']} className={styles.empty}>{t('chat_notFound')}</P>
        }
      </div>
      <div className={styles.draggable} draggable={true} onDragStart={initial} onDrag={(e)=> resize(e)}></div>
      {isTabletWidth &&
        <MobileBottomMenu/>
      }
    </div>
  )
}