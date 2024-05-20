import styles from './index.module.scss'

import { IMessage } from 'data/interfaces/IChat'
import { ApplicationStatus, MessageType, ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import Image from 'next/image'
import MessageReadSvg from 'components/svg/MessageReadSvg'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import AudioNode from './AudioNode'
import { useAppContext } from 'context/state'
import { IApplication } from 'data/interfaces/IApplication'
import Spacer from 'components/ui/Spacer'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { ImageViewerModalProps } from 'components/modals/ImageViewerModal'
import { ApplicationEmployeeNode, ApplicationHirerNode } from './ApplicationNode'
import ImageHelper from 'utils/ImageHelper'
import useTranslation from 'next-translate/useTranslation'
import OptionsDropDown from '@/components/ui/OptionsDropDown'
import OptionsList, { IOptionList } from '@/components/ui/OptionsList'
import { useRef } from 'react'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import { ForwardMessageModalArgs } from '@/components/modals/ForwardMessageModal'
import { useChatContext } from 'context/chat_state'
import { RemoveMessageConfirmModalArgs } from '@/components/modals/RemoveMessageConfirmModal'
import { useChatDialogContext } from 'context/chat_dialog_state'
import TrashBasketSvg from '@/components/svg/TrashBasketSvg'
import P from '@/components/ui/P'
import { getUserName } from 'utils/helpers'

interface Props {
  profileId?: number
  message: IMessage
  application?: IApplication
  onReply?: (msg: IMessage) => void
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
  const timeout = useRef<ReturnType<typeof setInterval>>()
  
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
        appContext.hideModal()
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
    // alert('set pinned')
    openDropDown(false)
  }

  const allOptions: {[key: string]: IOptionList} = {
    reply: {title: 'Ответить', onClick: replyHandler},
    copy: {title: 'Скопировать', onClick: ()=>{}},
    setPinned: {title: 'Закрепить', onClick: setPinned},
    forward: {title: 'Переслать', onClick: openForwardModal},
    choose: {title: 'Выбрать', onClick: ()=>{}},
    remove: {title: 'Удалить', icon: <TrashBasketSvg/>, onClick: openDeleteMessageModal},
  }

  const rightOptions: IOptionList[] = [allOptions.remove, allOptions.forward, allOptions.setPinned]
  const leftOptions : IOptionList[] = [allOptions.forward, allOptions.setPinned]

  const options = <OptionsList options={Object.values(allOptions)} 
  onMouseLeave={()=>{}}/>

  const optionsDropDown = (
    <OptionsDropDown 
    key={'dropdown'+props.message.id}
    options={options} 
    active={dropDown} 
    getRef={(r)=>{dropRef.current = r}} 
    usePopper
    popperPlacement={isPhoneWidth?'auto':'left-end'}
    onClose={()=>{}}/>
  )

  const onRightClick = (e: React.MouseEvent<HTMLDivElement>) => {    
    e.preventDefault()
    e.stopPropagation()
    openDropDown(true)
  }

  const replyedMessage = (
    <>
    {props.message.replyTo &&
      <div className={styles.replyedMessage}>
        <P styleType={['small', 'blue']}>{getUserName(props.message.replyTo.profile)}</P>
        <P styleType={['small']}>{props.message.replyTo.message}</P>
      </div>
    }
    </>
  )


  const stats = (
    <>
    <div className={styles.stats} ref={itemRef} key={props.message.id}>
    {props.message.forwarded&&<P styleType={['small', 'greyLight']}>Переслано от {getUserName(msg.profile)}</P>}
      <span className={styles.time}>{Formatter.formatDateRelative(msg.createdAt)}</span>
      <MessageReadSvg color={!msg.isRead&&colors.greyLight}/>     
    </div>
    </>
  )

  const textMessage = (
    <div className={side} ref={itemRef} onContextMenu={onRightClick} key={props.message.id}>
      {replyedMessage}
      <p className={styles.message}>
        {msg.message}
      </p>
      {stats}
      {optionsDropDown}

    </div>
  )

  const assetMessage = (
    <div key={props.message.id} ref={itemRef} onContextMenu={!isPhoneWidth&&onRightClick} className={classNames(side, styles.asset, msg?.assets?.length === 1&&!msg.message&&styles.single)}>
      <div className={styles.imagesWrapper}>
        {msg.pastedImages && msg.pastedImages.length>0&&
          msg.pastedImages.map(el=>{
            return <div className={classNames(styles.image, msg.pastedImages.length>1&&styles.image_half)}>
              <img onClick={()=>appContext.showModal<ImageViewerModalProps>(ModalType.ImageViewerModal, {src: URL.createObjectURL(el)})} src={URL.createObjectURL(el)} />
              <Spinner className={styles.spinner} size={44} color={colors.blue}/>
            </div>
          })
        }
      {msg.assets&&msg.assets.length>0&&msg.assets.map(image=> {
        return <div className={classNames(styles.image, msg.assets.length>1&&styles.image_half)}>
          <Image 
          unoptimized
          onClick={()=>appContext.showModal<ImageViewerModalProps>(ModalType.ImageViewerModal, {src: ImageHelper.urlFromSource(image.source)})} 
          src={ImageHelper.urlFromSource(image.source)} 
          alt={'asset'} 
          width={msg.assets.length>1?200:400} 
          height={msg.assets.length>1?200:400} 
          style={{width: '100%', objectFit: 'cover'}} />
        </div>
      })}
      </div>
      <p className={styles.message}>
        {msg.message}
      </p>
      {stats}
      {optionsDropDown}
    </div>
  )

  

  const applicationMessage = (<>
    {
    props.application?.status !== ApplicationStatus.Rejected 
    && profileType === ProfileType.Hirer 
    && props.application?.status !== ApplicationStatus.Accepted 
    && props.application?.cv?.published 
    &&
      <div key={props.message.id} className={classNames(isPhoneWidth?styles.rightMessage:side, styles.decision)}>
        <ApplicationHirerNode application={props.application} message={msg as IMessage}/>
      </div>
    }
    <div className={side} ref={itemRef } onContextMenu={onRightClick} >
      {replyedMessage}
        <ApplicationEmployeeNode application={props.application} message={msg as IMessage} profileType={profileType}/>
        {stats}
        {optionsDropDown}
    </div>
  </>
  )

  const proposalMessage = (<>
    <div className={side} onContextMenu={onRightClick} ref={itemRef }  key={props.message.id}>
      {replyedMessage}
      <p className={styles.message}>{t('chat_cvApplication')}</p>
      <Spacer basis={8} />
      <p dangerouslySetInnerHTML={{__html: msg.proposal?.coverLetter}} ></p>
      {stats}
      {optionsDropDown}
    </div>
  </>)

  const voiceMessage = (
    <div className={side} onContextMenu={onRightClick} ref={itemRef } key={props.message.id}>
      {replyedMessage}
      {msg?.assets?.length > 0 &&
        <AudioNode isLoading={!!msg.voiceMessage} audioSrc={!msg?.voiceMessage?(ImageHelper.urlFromSource(msg?.assets[0]?.source)):(URL.createObjectURL(msg?.voiceMessage))}/>
      }
      {stats}
      {optionsDropDown}
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
        return msg?.proposal?.coverLetter?proposalMessage:null
      case MessageType.Voice:
        return voiceMessage
      default :
        return textMessage
    }
  })()

  return (body)
}