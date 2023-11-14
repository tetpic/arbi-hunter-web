import styles from './index.module.scss'

import { IMessage } from 'data/interfaces/IChat'
import { ApplicationBSSelectType, ApplicationStatus, MessageType, ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import Image from 'next/image'
import { FILES } from 'types/constants'
import MessageReadSvg from 'components/svg/MessageReadSvg'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import AudioNode from './AudioNode'
import { useResize } from 'components/hooks/useResize'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { IProposalTextModalProps } from 'components/modals/ProposalModal/ProposalTextModal'
import { IApplication } from 'data/interfaces/IApplication'
import Spacer from 'components/ui/Spacer'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import PlusSvg from 'components/svg/PlusSvg'
import { IResponseModalProps } from 'components/modals/ResponseModal'
import { ImageViewerModalProps } from 'components/modals/ImageViewerModal'

interface Props {
  profileId: number
  message: IMessage
  application: IApplication
}


export default function MessageFactory(props: Props) {
  const {isPhoneWidth} = useResize()
  const appContext = useAppContext()
  const userContext = useUserContext()
  const profileType = userContext?.currentProfile?.profileType

  
  const side:string = props.profileId===props.message.profileId?styles.rightMessage:styles.leftMessage
  const msg = props.message

  const stats = (
    <div className={styles.stats}>
      <span className={styles.time}>{Formatter.formatDateRelative(msg.createdAt)}</span>
        <MessageReadSvg color={!msg.isRead&&colors.greyLight}/>
    </div>
  )

  const textMessage = (
    <div className={side}>
      <p className={styles.message}>
        {msg.message}
      </p>
      {stats}
    </div>
  )

  const assetMessage = (
    <div className={classNames(side, styles.asset, msg.assets.length === 1&&!msg.message&&styles.single)}>
      <div className={styles.imagesWrapper}>
        {msg.pastedImages && msg.pastedImages.length>0&&
          msg.pastedImages.map(el=>{
            return <div className={classNames(styles.image, msg.pastedImages.length>1&&styles.image_half)}>
              <img onClick={()=>appContext.showModal<ImageViewerModalProps>(ModalType.ImageViewerModal, {src: URL.createObjectURL(el)})} src={URL.createObjectURL(el)} />
              <Spinner className={styles.spinner} size={44} color={colors.yellow}/>
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
    {props.application?.status !== ApplicationStatus.Rejected && profileType === ProfileType.Hirer && props.application?.status !== ApplicationStatus.Accepted &&
      <div className={classNames(isPhoneWidth?styles.rightMessage:side, styles.decision)}>
        <Button 
        onClick={()=>{
          appContext.showModal<IProposalTextModalProps>(ModalType.ProposalTextModal, {type: ApplicationBSSelectType.ThisVacancy, application: props.application, cv: props.application.cv, vcId: props.application.vacancyId})
        }} 
        className={styles.button}
        >
          Пригласить
        </Button>
      
        <Button 
        onClick={()=>{
          appContext.showModal<IProposalTextModalProps>(ModalType.ProposalTextModal, {type: ApplicationBSSelectType.Reject, application: props.application, cv: props.application.cv, vcId: props.application.vacancyId})
        }} 
        className={styles.button}
        >
          Отказать
        </Button>
      </div>
    }
    <div className={side}>
        <p className={styles.message}>Отклик на вакансию</p>
        <Spacer basis={8} />
        <p className={styles.message}>
          {props.application?.coverLetter}
          {!props.application?.coverLetter&&profileType === ProfileType.Employee&&
            <span>Без сопроводительного письма</span>
          }
        </p>
        {!props.application?.coverLetter &&
          <p className={styles.cover} onClick={()=> {
            appContext.showModal<IResponseModalProps>(ModalType.ResponseModal, {cv: props.application?.cv, application: props.application})
          }}>
            <PlusSvg/>
            Сопроводительное письмо
          </p>
        }
        {stats}
    </div>
  </>
  )

  const proposalMessage = (<>
    {msg?.proposal?.coverLetter &&
      <div className={side}>
        <p className={styles.message}>Отклик на резюме</p>
        <Spacer basis={8} />
        <p dangerouslySetInnerHTML={{__html: msg.proposal?.coverLetter}} ></p>
        {stats}
      </div>
    }
  </>)

  const voiceMessage = (
    <div className={side}>
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