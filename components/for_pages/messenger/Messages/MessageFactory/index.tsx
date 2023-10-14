import { IMessage } from 'data/interfaces/IChat'
import styles from './index.module.scss'
import { MessageType } from 'types/enums'
import Formatter from 'utils/formatter'

interface Props {
  profileId: number
  message: IMessage
}


export default function MessageFactory(props: Props) {

  const isMyMessage:boolean = props.message.profileId?props.profileId===props.message.profileId:true
  const msg = props.message

  const textMessage = (
    <div className={isMyMessage?styles.rightMessage:styles.leftMessage}>
      {msg.message}
      <span>{Formatter.formatDateRelative(msg.createdAt)}</span>
    </div>
  )

  const assetMessage = (
    <>assetMessage</>
  )

  const applicationMessage = (
    <>application message</>
  )

  const proposalMessage = (
    <>proposal</>
  )

  const voiceMessage = (
    <>voice message</>
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