import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import InformationSvg from 'components/svg/InformationSvg'
import MicrophoneSvg from 'components/svg/MicrophoneSvg'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import MessageFactory from './MessageFactory'
import { useState } from 'react'
import styles from './index.module.scss'
import { useChatDialogContext } from 'context/chat_dialog_state'

interface Props {
}

export default function Messages(props: Props) {
  const dialog = useChatDialogContext()
  const {messages} = dialog
  const userContext = useUserContext()
  const [value, setValue] = useState<string>()

  const sendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (!value.replace(/\s+/g, ' ').trim()) {
      return
    }
    if(e.key === 'Enter') {
      dialog.sendMessage({message:value})
      setValue('')
    }
  }

  return (
    <div className={styles.root}> 
      <div className={styles.top}>
        <UserPic size={48} className={styles.userPic} image={dialog.chat.profile?.image&& FILES + dialog?.chat.profile.image.source}/>
        <p className={styles.name}>{dialog.chat?.profile.company||dialog.chat?.profile.firstName + ' ' + dialog.chat?.profile.lastName}</p>
        <p className={styles.time}>В сети c {Formatter.formatDateRelative(dialog.chat?.profile.lastActivityAt)}</p>
        <ThreeDotsButton className={styles.dots}/>
      </div>
      {userContext?.currentProfile?.profileType === ProfileType.Employee &&
        <div className={styles.invite}>
          <p className={styles.invite__title}>Вас пригласили на вакансию</p>
          <p className={styles.invite__vacancy}>{dialog.chat?.application?.cv?.position}</p>
          <InformationSvg className={styles.invite__info}/>
        </div>
      }
      <div className={styles.messages}>
        {[...messages.values()].map(el=> {
          return <MessageFactory profileId={userContext.currentProfile.id} message={el}/>
        })}
      </div>
      <div className={styles.newMessage}>
        <input value={value} onChange={(e)=>setValue(e.currentTarget.value)} onKeyDown={(e)=>e.key==='Enter'&&sendMessage(e)} className={styles.input} type="text" placeholder='Введите сообщение...' />
        <MicrophoneSvg/>
      </div>
    </div>
  )
}
