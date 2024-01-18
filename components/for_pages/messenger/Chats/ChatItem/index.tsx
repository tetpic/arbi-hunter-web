import styles from './index.module.scss'

import UserPic from 'components/ui/UserPic'
import Formatter from 'utils/formatter'
import TextNode from 'components/ui/TextNode'
import classNames from 'classnames'
import IChat from 'data/interfaces/IChat'
import { getUserImageSource } from 'utils/helpers'

interface Props {
  chat: IChat
  isActive: boolean
  onClick: (c: IChat) => void
}

export default function ChatItem(props: Props) {
  const chat = props.chat

  const collocutor = chat.profiles[0].role === 'admin'?chat.participant:chat.profile

  const onClickHandler = () => {
    props.onClick(chat)
  }

  return (
    <div className={classNames(styles.root, props.isActive&&styles.active)} onClick={onClickHandler}> 
      <UserPic size={56} className={classNames(styles.userPic, props.isActive&&styles.userPic_active)}  image={getUserImageSource(collocutor)}/>
      <p className={styles.name}>{collocutor?collocutor?.firstName + ' ' + collocutor?.lastName:'DELETED'}</p>
      <p className={styles.time}>{Formatter.formatDateRelative(chat.lastMessageAt)}</p>
      <p className={styles.lastMessage}> {props.chat?.last?.proposal&&<TextNode html={chat.last.proposal.coverLetter}/>||chat.lastMessage||chat?.last?.message} </p>
      {props.chat.totalUnread > 0&&
        <p className={styles.counter}>{props.chat.totalUnread}</p>
      }
    </div>
  )
}