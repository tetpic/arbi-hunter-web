import { IChat } from 'data/interfaces/Common'
import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import TextNode from 'components/ui/TextNode'
import classNames from 'classnames'
import styles from './index.module.scss'

interface Props {
  chat: IChat
  onClick: (c: IChat) => void
  current: boolean
}

export default function ChatItem(props: Props) {
  const chat = props.chat

  return (<div className={classNames(styles.root, props.current&&styles.active)} onClick={()=> props.onClick(chat)}> 
    <UserPic size={56} className={styles.userPic} image={chat.profile.image&& FILES +chat.profile.image.source}/>
    <p className={styles.name}>{chat.profile.company||chat.profile.firstName + ' ' + chat.profile.lastName}</p>
    <p className={styles.time}>{Formatter.formatDateRelative(chat.lastMessageAt)}</p>
    <p className={styles.lastMessage}> {props.chat?.last?.proposal&&<TextNode html={props.chat.last.proposal.coverLetter}/>} </p>
    <p className={styles.counter}>1</p>
  </div>)
}