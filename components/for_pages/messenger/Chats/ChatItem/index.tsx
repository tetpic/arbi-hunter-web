import styles from './index.module.scss'

import UserPic from 'components/ui/UserPic'
import Formatter from 'utils/formatter'
import TextNode from 'components/ui/TextNode'
import classNames from 'classnames'
import IChat from 'data/interfaces/IChat'
import { getUserImageSource, getUserName } from 'utils/helpers'
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
import { IConfirmModalProps } from '@/components/modals/ConfirmModal'
import { ProfileType } from 'data/interfaces/IRegistration'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  chat: IChat
  isActive: boolean
  onClick: (c: IChat) => void
}

export default function ChatItem(props: Props) {
  const {t} = useTranslation()
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
    openDropDown(false)
    ChatRepository.updateChatProfile({pinned: !chat.profiles?.[0]?.pinned}, chat.id)
    .then(res => {
      const newChat = {...chat, profiles: [res]}
      chatContext.editChat(newChat)
    })
  }

  const changeFolder = () => {
    openDropDown(false)
    const _args:ChangeChatFolderModalArgs = {
      folders: [...chatContext.folders.values()],
      currentChat: chat,
      onSave: (id) => {
        isTabletWidth?appContext.hideBottomSheet:appContext.hideModal()
        ChatRepository.updateChatProfile({chatFolderId: id}, chat.id)
        .then(res => {
          const newChat = {...chat, profiles: [res]}
          chatContext.editChat(newChat)
          isTabletWidth?appContext.hideBottomSheet():appContext.hideModal()
        })
      }
    }
    isTabletWidth
    ?appContext.showBottomSheet<ChangeChatFolderModalArgs>(ModalType.ChangeChatFolderModal, _args)
    :appContext.showModal<ChangeChatFolderModalArgs>(ModalType.ChangeChatFolderModal, _args )
  }
   
  const removeChat = () => {
    openDropDown(false)
    const _args:IConfirmModalProps = {
      text: t('chat_deleteChatConfirmMessage') + getUserName(collocutor),
      callback: () => {
        ChatRepository.removeOneChat(chat.id)
        .then(res => {
          chatContext.removeChat(chat.id)
          isTabletWidth?appContext.hideBottomSheet():appContext.hideModal()
        })
      }
    }
    isTabletWidth
    ?appContext.showBottomSheet<IConfirmModalProps>(ModalType.ConfirmModal, _args, 180)
    :appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, _args)
  }
  
 
  const optionsList: IOptionList[] = [
    chatContext.folders.size>0&&(chatContext.folders.size ===1? !chat.profiles?.[0]?.pinned:true)&&{title: t('chat_changeFolder'),  icon: <FolderSvg/>,onClick: changeFolder},
    {title: chat.profiles[0].pinned?t('chat_unpin'):t('chat_pin'), icon: <PinMessageSvg/> , onClick: pinChat},
    {title: t('chat_remove'), icon: <TrashBasketSvg/>, onClick: removeChat}
  ].filter(Boolean)


  const options = <OptionsList options={optionsList} onMouseLeave={()=>openDropDown(false)}/>



  return (
    <div className={classNames(styles.root, props.isActive&&styles.active)} ref={itemRef} onContextMenu={onRightClick} onClick={onClickHandler}> 
      <UserPic 
      size={56} 
      className={classNames(styles.userPic, props.isActive&&styles.userPic_active)}  
      image={getUserImageSource(collocutor, Preset.smallIconCrop)}
      />
      {props.chat.profiles?.[0]?.pinned &&
        <PinMessageSvg className={styles.pinIcon}/>
      }
      <P styleType={['medium', 'w500']} useThemeColor className={styles.name}>{collocutor?.profileType === ProfileType.Employee?getUserName(collocutor):collocutor?.company}</P>
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