import styles from './index.module.scss'

import { IMessage } from 'data/interfaces/IChat'
import { ApplicationStatus, MessageType, ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import Image from 'next/image'
import { FILES } from 'types/constants'
import MessageReadSvg from 'components/svg/MessageReadSvg'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import AudioNode from './AudioNode'
import { useResize } from 'components/hooks/useResize'
import { useAppContext } from 'context/state'
import { IApplication } from 'data/interfaces/IApplication'
import Spacer from 'components/ui/Spacer'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { ImageViewerModalProps } from 'components/modals/ImageViewerModal'
import { useChatDialogContext } from 'context/chat_dialog_state'
import { ApplicationEmployeeNode, ApplicationHirerNode } from './ApplicationNode'

interface Props {
  profileId: number
  message: IMessage
  application: IApplication
}


export default function MessageFactory(props: Props) {
  const {isPhoneWidth} = useResize()
  const appContext = useAppContext()
  const userContext = useUserContext()
  const dialogContext = useChatDialogContext()
  const profileType = userContext?.currentProfile?.profileType

  const side:string = userContext?.currentProfile?.userId===props.message.profile?.userId||userContext?.currentProfile?.id===props.message.profileId?styles.rightMessage:styles.leftMessage
  const msg = props.message


  const stats = (
    <div className={styles.stats} key={props.message.id}>
      <span className={styles.time}>{Formatter.formatDateRelative(msg.createdAt)}</span>
      <MessageReadSvg color={!msg.isRead&&colors.greyLight}/>
    </div>
  )

  const textMessage = (
    <div className={side} key={props.message.id}>
      <p className={styles.message}>
        {msg.message}
      </p>
      {stats}
    </div>
  )

  const assetMessage = (
    <div key={props.message.id} className={classNames(side, styles.asset, msg?.assets?.length === 1&&!msg.message&&styles.single)}>
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
          <Image onClick={()=>appContext.showModal<ImageViewerModalProps>(ModalType.ImageViewerModal, {src: FILES+ image.source})} src={FILES+ image.source} alt={'asset'} width={msg.assets.length>1?200:400} height={msg.assets.length>1?200:400} style={{width: '100%', objectFit: 'cover'}} />
        </div>
      })}
      </div>
      <p className={styles.message}>
        {msg.message}
      </p>
      {stats}
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
        <ApplicationHirerNode application={props.application} message={msg}/>
      </div>
    }
    <div className={side}>
        <ApplicationEmployeeNode application={props.application} message={msg} profileType={profileType}/>
        {stats}
    </div>
  </>
  )

  const proposalMessage = (<>
    {msg?.proposal?.coverLetter &&
      <div className={side} key={props.message.id}>
        <p className={styles.message}>Отклик на резюме</p>
        <Spacer basis={8} />
        <p dangerouslySetInnerHTML={{__html: msg.proposal?.coverLetter}} ></p>
        {stats}
      </div>
    }
  </>)

  const voiceMessage = (
    <div className={side} key={props.message.id}>
      {msg?.assets?.length > 0 &&
        <AudioNode isLoading={!!msg.voiceMessage} audioSrc={!msg?.voiceMessage?(FILES + msg?.assets[0]?.source):(URL.createObjectURL(msg?.voiceMessage))}/>
      }
      {stats}
    </div>
  )

  const body:JSX.Element = (()=> {
    switch(props.message.type) {
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