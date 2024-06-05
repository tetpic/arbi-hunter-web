import styles from './index.module.scss'

import { IMessage } from 'data/interfaces/IChat'
import { ApplicationStatus, MessageType, ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import MessageReadSvg from 'components/svg/MessageReadSvg'
import { colors } from 'styles/variables'
import AudioNode from './AudioNode'
import { useAppContext } from 'context/state'
import { IApplication } from 'data/interfaces/IApplication'
import Spacer from 'components/ui/Spacer'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { ApplicationEmployeeNode, ApplicationHirerNode } from './ApplicationNode'
import ImageHelper from 'utils/ImageHelper'
import useTranslation from 'next-translate/useTranslation'
import OptionsDropDown from '@/components/ui/OptionsDropDown'
import OptionsList, { IOptionList } from '@/components/ui/OptionsList'
import {  useRef } from 'react'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import { ForwardMessageModalArgs } from '@/components/modals/ForwardMessageModal'
import { useChatContext } from 'context/chat_state'
import { RemoveMessageConfirmModalArgs } from '@/components/modals/RemoveMessageConfirmModal'
import { useChatDialogContext } from 'context/chat_dialog_state'
import TrashBasketSvg from '@/components/svg/TrashBasketSvg'
import P from '@/components/ui/P'
import { copyToClipboard, getUserName } from 'utils/helpers'
import AnswerMessageSvg from '@/components/svg/AnswerMessageSvg'
import DoubleSvg from '@/components/svg/DoubleSvg'
import SetMessageSvg from '@/components/svg/SetMessageSvg'
import ShareMessageSvg from '@/components/svg/ShareMessageSvg'
import PinMessageSvg from '@/components/svg/PinMessageSvg'
import ImageNode from './ImageNode'
import FileNode from './FileNode'
import ChatRepository from 'data/repositories/ChatRepository'

interface Props {
  profileId?: number
  message: IMessage
  application?: IApplication
  onReply?: (msg: IMessage) => void
  onSet?: (msg: IMessage) => void
  multiCheckMode?: boolean
}


export default function MessageFactory(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const {isPhoneWidth} = appContext.size
  const userContext = useUserContext()
  const profileType = userContext?.currentProfile?.profileType
  const dropRef = useRef(null!)
  const itemRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const chatContext = useChatContext()
  const dialog = useChatDialogContext()
  const chats = chatContext.chats
  const msg = props.message.forwarded?props.message.forwarded:props.message
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  
  
  const collocutor = userContext?.currentProfile?.userId===props.message.profile?.userId||userContext?.currentProfile?.id===props.message?.profileId?'me':'other'
  const side:string = userContext?.currentProfile?.userId===props.message.profile?.userId||userContext?.currentProfile?.id===props.message?.profileId?styles.rightMessage:styles.leftMessage

  const openForwardModal = () => {
    appContext.showModal<ForwardMessageModalArgs>(ModalType.ForwardMessageModal, {
      chats: [...chats.values()],
      forwardedId: Number(props.message.id),
      forwardedMessage: props.message,
      onSend: (chatId: number) => {
        chatContext.setCurrentChatId(chatId)
        appContext.hideModal()
      }
    })
    openDropDown(false)
  }

  const openDeleteMessageModal = () => {
    const args:RemoveMessageConfirmModalArgs = {
      canRemoveForAll: collocutor === 'me',
      onSend: (type) => {
        dialog.removeMessage(type, Number(props.message.id))
        isPhoneWidth?appContext.hideBottomSheet():appContext.hideModal()
      }
    }
    isPhoneWidth
    ?appContext.showBottomSheet<RemoveMessageConfirmModalArgs>(ModalType.RemoveMessageConfirmModal, args, 250)
    :appContext.showModal<RemoveMessageConfirmModalArgs>(ModalType.RemoveMessageConfirmModal, args)
    openDropDown(false)
  }

  const replyHandler = () => {
    props.onReply(msg)
    openDropDown(false)
  }

  const setPinned = () => {
    ChatRepository.setMessagePinned(Number(props.message.id), !props.message.pinned)
    .then(res => {
      
    })
    openDropDown(false)
  }

  const onSet = () => {
    props.onSet(props.message)
    openDropDown(false)
  }

  const allOptions: {[key: string]: IOptionList|null} = {
    reply: {title: t('chat_reply'), icon: <AnswerMessageSvg/>, onClick: replyHandler},
    copy: {title: t('chat_copyMessage'), icon: <DoubleSvg/> ,onClick: ()=>copyToClipboard(props.message.message)},
    setPinned: dialog.chat?.profiles?.[0].role==='participant'?null:{title: t('chat_pin'), icon: <PinMessageSvg/>, onClick: setPinned},
    forward: {title: t('chat_forwardMesssage'), icon: <ShareMessageSvg/>, onClick: openForwardModal},
    choose: {title: t('chat_setMessage'), icon: <SetMessageSvg/>, onClick: onSet},
    remove: {title: t('chat_removeMessage'), icon: <TrashBasketSvg/>, onClick: openDeleteMessageModal},
  }

  const rightOptions: IOptionList[] = [allOptions.remove, allOptions.forward, allOptions.setPinned]
  const leftOptions : IOptionList[] = [allOptions.forward, allOptions.setPinned]

  const options = <OptionsList options={Object.values(allOptions).filter(Boolean)} 
  onMouseLeave={()=>openDropDown(false)}/>

  const optionsDropDown = (
    <OptionsDropDown 
    key={'dropdown'+props.message.id}
    options={options} 
    active={dropDown} 
    getRef={(r)=>{dropRef.current = r}} 
    usePopper
    popperPlacement={isPhoneWidth?'auto-end':'left-start'}
    onClose={()=>{openDropDown(false)}}/>
  )

  const onRightClick = (e: React.MouseEvent<any>, type: 'context'|'touch') => {    
    e?.preventDefault()
    if(type === 'context') {
      openDropDown(true)
    }
    else if(type === 'touch') {
      timeout.current = setTimeout(()=>openDropDown(true), 680)
    }
  }

  const replyedMessage = (
    <>
    {props.message.replyTo &&
      <div className={styles.replyedMessage}>
        <P styleType={['small', 'blue']}>{getUserName(props.message.replyTo.profile)}</P>
        <P styleType={['small']} useThemeColor>{props.message.replyTo.message}</P>
      </div>
    }
    </>
  )


  const stats = (
    <>
    <div className={styles.stats} ref={itemRef} key={props.message.id}>
    {props.message.forwarded&&<P styleType={['small', 'greyLight']}>{t('chat_forwardedFrom')} {getUserName(msg.profile)}</P>}
      <span className={styles.time}>{Formatter.formatDateRelative(msg.createdAt)}</span>
      <MessageReadSvg color={!msg.isRead&&colors.greyLight}/>     
    </div>
    </>
  )

  const textMessage = (
    <div 
    className={side} 
    ref={itemRef} 
    onContextMenu={(e)=>onRightClick(e, 'context')}  
    onTouchStart={(e)=>onRightClick(null, 'touch')}
    onTouchCancel={() => clearTimeout(timeout.current)}
    onTouchMove={() => clearTimeout(timeout.current)}
    onTouchEnd={() => clearTimeout(timeout.current)}
    key={props.message.id}
    >
      {optionsDropDown}
      {replyedMessage}
      <p className={styles.message}>
        {msg.message}
      </p>
      {stats}
    </div>
  )

  const assetMessage = (
    <div 
    key={props.message.id} 
    ref={itemRef} 
    onContextMenu={(e)=>onRightClick(e, 'context')} 
    onTouchStart={(e)=>onRightClick(null, 'touch')}
    onTouchCancel={() => clearTimeout(timeout.current)}
    onTouchEnd={() => clearTimeout(timeout.current)}
    onTouchMove={() => clearTimeout(timeout.current)}
    className={classNames(
      side, 
      styles.asset, 
      ((msg?.assets?.length === 1 || msg?.pastedImages?.length === 1)
      &&(msg?.assets?.[0].mimeType.includes('image')||msg?.pastedImages?.[0].type.includes('image')))
      &&!msg.message&&styles.single
    )}>
      {optionsDropDown}
      {((msg.pastedImages && msg.pastedImages.length>0 && msg.pastedImages[0].type.includes('image'))||
      (msg.assets && msg.assets.length>0 && msg.assets[0].mimeType.includes('image')))&&
        <ImageNode message={msg}/>
        ||
        <FileNode message={msg}/>
      }

      <p className={styles.message}>
        {msg.message}
      </p>
      {stats}
      
    </div>
  )

  

  const applicationMessage = (<>

    <div 
    className={side} 
    ref={itemRef } 
    onContextMenu={(e)=>onRightClick(e, 'context')}  
    onTouchStart={(e)=>onRightClick(null, 'touch')}
    onTouchCancel={() => clearTimeout(timeout.current)}
    onTouchEnd={() => clearTimeout(timeout.current)}
    onTouchMove={() => clearTimeout(timeout.current)}
    >
    { optionsDropDown}
      {replyedMessage}
        <ApplicationEmployeeNode application={props.application} message={msg as IMessage} profileType={profileType}/>
        {stats}
    </div>
    {
    props.message.application?.status !== ApplicationStatus.Rejected 
    && profileType === ProfileType.Hirer 
    && props.message.application?.status !== ApplicationStatus.Accepted 
    && props.message.application?.cv?.published 
    &&
      <div key={props.message.id} className={classNames(isPhoneWidth?styles.rightMessage:side, styles.decision)}>
        <ApplicationHirerNode application={props.application} message={msg as IMessage}/>
      </div>
    }
  </>
  )

  const proposalMessage = (<>
    <div 
    className={side} 
    onContextMenu={(e)=>onRightClick(e, 'context')}  
    onTouchStart={(e)=>onRightClick(null, 'touch')}
    onTouchCancel={() => clearTimeout(timeout.current)}
    onTouchEnd={() => clearTimeout(timeout.current)}
    onTouchMove={() => clearTimeout(timeout.current)}
    ref={itemRef }  
    key={props.message.id}
    >
      {optionsDropDown}
      {replyedMessage}
      <p className={styles.message}>{t('chat_cvApplication')}</p>
      <Spacer basis={8} />
      {msg.proposal?.coverLetter &&
      <p dangerouslySetInnerHTML={{__html: msg.proposal?.coverLetter}} ></p>
      }
      {stats}
    </div>
  </>)

  const voiceMessage = (
    <div className={side} onContextMenu={(e)=>onRightClick(e, 'context')}  ref={itemRef } key={props.message.id}>
      {optionsDropDown}
      {replyedMessage}
      {msg?.assets?.length > 0 &&
        <AudioNode key={props.message.id} isLoading={!!msg.voiceMessage} audioSrc={!msg?.voiceMessage?(ImageHelper.urlFromSource(msg?.assets[0]?.source)):(URL.createObjectURL(msg?.voiceMessage))}/>
      }
      {stats}
    </div>
  )

  const body:JSX.Element = (()=> {
    switch(msg.type) {
      case MessageType.Text:
        return textMessage
      case MessageType.Application:
        return applicationMessage
      case MessageType.Asset:
        return assetMessage
      case MessageType.Proposal:
        return proposalMessage
      case MessageType.Voice:
        return voiceMessage
      default :
        return textMessage
    }
  })()

  return (body)
}