import styles from './index.module.scss'

import UserPic from 'components/ui/UserPic'
import Formatter from 'utils/formatter'
import TextNode from 'components/ui/TextNode'
import classNames from 'classnames'
import IChat from 'data/interfaces/IChat'
import { getUserImageSource } from 'utils/helpers'
import { ModalType, Preset } from 'types/enums'
import P from '@/components/ui/P'
import OptionsList, { IOptionList } from '@/components/ui/OptionsList'
import PinMessageSvg from '@/components/svg/PinMessageSvg'
import FolderSvg from '@/components/svg/FolderSvg'
import TrashBasketSvg from '@/components/svg/TrashBasketSvg'
import OptionsDropDown from '@/components/ui/OptionsDropDown'
import { useRef } from 'react'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import ChatRepository from 'data/repositories/ChatRepository'
import { useChatContext } from 'context/chat_state'
import { useAppContext } from 'context/state'
import { ChangeChatFolderModalArgs } from '@/components/modals/ChangeChatFolderModal'

interface Props {
  chat: IChat
  isActive: boolean
  onClick: (c: IChat) => void
}

export default function ChatItem(props: Props) {
  const chat = props.chat
  const chatContext = useChatContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const dropRef = useRef(null!)
  const itemRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)

  const collocutor = chat.profiles[0]?.role === 'admin'?chat.participant:chat.profile

  const onClickHandler = () => {
    props.onClick(chat)
  }

  const onRightClick = (e:  React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    openDropDown(true)
  }

  const pinChat = async() => {
    ChatRepository.updateChatProfile({pinned: !chat.profiles[0].pinned}, chat.id)
    .then(res => {
      const newChat = {...chat, profiles: [res]}
      chatContext.editChat(newChat)
      openDropDown(false)
    })
  }

   const changeFolder = () => {
    const _args:ChangeChatFolderModalArgs = {
      folders: [...chatContext.folders.values()],
      currentChat: chat,
      onSave: (id) => {
        openDropDown(false)
        isTabletWidth?appContext.hideBottomSheet:appContext.hideModal()
        ChatRepository.updateChatProfile({chatFolderId: id}, chat.id)
        .then(res => {
          const newChat = {...chat, profiles: [res]}
          chatContext.editChat(newChat)
        })
      }
    }
    isTabletWidth
    ?appContext.showBottomSheet<ChangeChatFolderModalArgs>(ModalType.ChangeChatFolderModal, _args)
    :appContext.showModal<ChangeChatFolderModalArgs>(ModalType.ChangeChatFolderModal, _args)
   }
   
   const removeChat = () => {

   }
  
 
  const optionsList: IOptionList[] = [
    chatContext.folders.size>0&&(chatContext.folders.size ===1? !chat.profiles[0].pinned:true)&&{title: 'Сменить папку',  icon: <FolderSvg/>,onClick: changeFolder},
    {title: chat.profiles[0].pinned?'Открепить':'Закрепить', icon: <PinMessageSvg/> , onClick: pinChat},
    {title: 'Удалить', icon: <TrashBasketSvg/>, onClick: removeChat}
  ].filter(Boolean)


  const options = <OptionsList options={optionsList} onMouseLeave={()=>openDropDown(false)}/>



  return (
    <div className={classNames(styles.root, props.isActive&&styles.active)} onContextMenu={onRightClick} onClick={onClickHandler}> 
      <UserPic 
      size={56} 
      className={classNames(styles.userPic, props.isActive&&styles.userPic_active)}  
      image={getUserImageSource(collocutor, Preset.smallIconCrop)}
      />
      {props.chat.profiles[0].pinned &&
        <PinMessageSvg className={styles.pinIcon}/>
      }
      <P styleType={['medium', 'w500']} useThemeColor className={styles.name}>{collocutor?collocutor?.firstName + ' ' + collocutor?.lastName:'DELETED'}</P>
      <p className={styles.time}>{Formatter.formatDateRelative(chat.lastMessageAt)}</p>
      <p className={styles.lastMessage}> {props.chat?.last?.proposal&&<TextNode html={chat.last.proposal.coverLetter}/>||chat.lastMessage||chat?.last?.message} </p>
      {props.chat.totalUnread > 0&&
        <p className={styles.counter}>{props.chat.totalUnread}</p>
      }
      <OptionsDropDown 
      usePopper
      options={options} 
      active={dropDown} 
      key={chat.id}
      getRef={(r)=>{dropRef.current = r}}
      onClose={()=>{openDropDown(false)}}/>

    </div>
  )
}