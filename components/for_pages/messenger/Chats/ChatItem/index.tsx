import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import TextNode from 'components/ui/TextNode'
import classNames from 'classnames'
import styles from './index.module.scss'
import IChat from 'data/interfaces/IChat'
import { useRouter } from 'next/router'

interface Props {
  chat: IChat
  isActive: boolean
  onClick: (c: IChat) => void
}

export default function ChatItem(props: Props) {
  const router = useRouter()
  const chat = props.chat




  const onClickHandler = () => {
    props.onClick(chat)
  }

  

  return (
    <div className={classNames(styles.root, props.isActive&&styles.active)} onClick={onClickHandler}> 
      <UserPic size={56} className={styles.userPic} image={chat.profile.image&& FILES +chat.profile.image.source}/>
      <p className={styles.name}>{chat.profile.company||chat.profile.firstName + ' ' + chat.profile.lastName}</p>
      <p className={styles.time}>{Formatter.formatDateRelative(chat.lastMessageAt)}</p>
      <p className={styles.lastMessage}> {props.chat?.last?.proposal&&<TextNode html={chat.last.proposal.coverLetter}/>||chat?.last?.message} </p>
      <p className={styles.counter}>1</p>
    </div>
  )
}