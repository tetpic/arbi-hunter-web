import classNames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import BackBtn from 'components/ui/BackBtn'
import UserPic from 'components/ui/UserPic'
import { useAppContext } from 'context/state'
import { IUserProfile } from 'data/interfaces/IUser'
import { useState } from 'react'
import { FILES } from 'types/constants'
import styles from './index.module.scss'

interface Props {
  onClose: ()=> void
}

export default function MembersModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as IUserProfile[]
  const [filtered, setFiltered] = useState<IUserProfile[]>(args)

  const top = (<div className={styles.top}>
    <div className={styles.navigation}>
      <BackBtn className={styles.button} onClick={props.onClose} bgColor={'transparent'}/>
      <p className={styles.title}>Участники</p>
    </div>
    <input type="text" className={styles.input} placeholder={'Поиск по участникам'}/>
  </div>)

  const body = (<div className={styles.bodyWrapper}>
    {filtered.length > 0 &&filtered.map(member=> {
      return <div className={styles.member}>
        <UserPic size={42} image={member.image&&FILES+member.image.source}/>
        <p className={styles.name}>{member.firstName} {member.lastName}</p>
        <p className={classNames(styles.status, styles[member.activityStatus])}>{member.activityStatus}</p>
      </div>
    })
    ||
    <p className={'empty'}>Участников не найдено</p>
    }
  </div>)

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {top}
      {body}
    </ModalBody>
  </ModalLayout>)
}