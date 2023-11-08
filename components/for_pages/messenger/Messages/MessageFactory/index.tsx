import { IMessage } from 'data/interfaces/IChat'
import { MessageType } from 'types/enums'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import Image from 'next/image'
import { FILES } from 'types/constants'
import MessageReadSvg from 'components/svg/MessageReadSvg'
import styles from './index.module.scss'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import AudioNode from './AudioNode'

interface Props {
  profileId: number
  message: IMessage
}


export default function MessageFactory(props: Props) {
  
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
    <div className={classNames(side, styles.asset)}>
      <div className={styles.imagesWrapper}>
        {msg.pastedImages && msg.pastedImages.length>0&&
          msg.pastedImages.map(el=>{
            return <div className={classNames(styles.image, msg.pastedImages.length>1&&styles.image_half)}>
              <img src={URL.createObjectURL(el)} />
              <Spinner className={styles.spinner} size={44} color={colors.yellow}/>
            </div>
          })
        }
      {msg.assets&&msg.assets.length>0&&msg.assets.map(image=> {
        return <div className={classNames(styles.image, msg.assets.length>1&&styles.image_half)}>
          <Image src={FILES+ image.source} alt={'asset'} width={msg.assets.length>1?200:400} height={msg.assets.length>1?200:400} style={{width: '100%', objectFit: 'cover'}} />
        </div>
      })}
      </div>
      <p className={styles.message}>
        {msg.message}
      </p>
      {stats}
    </div>
  )

  const applicationMessage = (
    <div className={side}>
      <p className={styles.message}>Отклик на вакансию</p>
      <p className={styles.message}>
        {props.message.application.coverLetter}
      </p>
      {stats}
  </div>
    
  )

  const proposalMessage = (<>
    {msg?.proposal?.coverLetter &&
      <div className={side}>
        <p dangerouslySetInnerHTML={{__html: msg.proposal?.coverLetter}} ></p>
        {stats}
      </div>
    }
  </>)

  const voiceMessage = (
    <div className={side}>
      <AudioNode isLoading={!!msg.voiceMessage} audioSrc={!msg?.voiceMessage?(FILES + msg?.assets[0]?.source):(URL.createObjectURL(msg?.voiceMessage))}/>
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