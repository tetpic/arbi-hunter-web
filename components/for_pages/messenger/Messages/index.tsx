import { IChat } from 'data/interfaces/Common'
import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import styles from './index.module.scss'
import InformationSvg from 'components/svg/InformationSvg'
import MicrophoneSvg from 'components/svg/MicrophoneSvg'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
// import { ProfileType } from 'data/interfaces/IRegistration'
// import {useUserContext}  from 'context/user_state'
// import { ProfileType } from 'data/interfaces/IRegistration'

interface Props {
  currentChat: IChat
}

export default function Messages(props: Props) {
  const userContext = useUserContext()
  const current = props.currentChat

  return (
    <div className={styles.root}> 
      <div className={styles.top}>
        <UserPic size={48} className={styles.userPic} image={current.profile?.image&& FILES + current.profile.image.source}/>
        <p className={styles.name}>{current.profile.company||current.profile.firstName + ' ' + current.profile.lastName}</p>
        <p className={styles.time}>В сети c {Formatter.formatDateRelative(current.profile.lastActivityAt)}</p>
        <ThreeDotsButton className={styles.dots}/>
      </div>
      {userContext?.currentProfile?.profileType === ProfileType.Hirer &&
        <div className={styles.invite}>
          <p className={styles.invite__title}>Вас пригласили на вакансию</p>
          <p className={styles.invite__vacancy}>{current.proposal?.cv?.position}</p>
          <InformationSvg className={styles.invite__info}/>
        </div>
      }
      <div className={styles.messages}>
        <p className={styles.leftMessage}>
            Здравствуйте, Алекс! <br />
            Меня зовут Максим, я HR-менеджер компании Google. 
            <span>{'10:30'}</span>

        </p>
        <p className={styles.rightMessage}>
          Здравствуйте, Алекс! <br />
          Меня зовут Максим, я HR-менеджер компании Google. 
          <span>{'10:30'}</span>
        </p>
      </div>
      <div className={styles.newMessage}>
        <input className={styles.input} type="text" placeholder='Введите сообщение...' />
        <MicrophoneSvg/>
      </div>
    </div>
  )
}
