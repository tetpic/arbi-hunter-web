import styles from './index.module.scss'

import Spinner from 'components/ui/Spinner'
import UserPic from 'components/ui/UserPic'
import { IUserProfile } from 'data/interfaces/IUser'
import { colors } from 'styles/variables'
import { getUserImageSource } from 'utils/helpers'

interface Props {
  members: IUserProfile[]
  loading: boolean
}

export default function CommunityMembers(props: Props) {

  return (<div className={styles.root}> 

  <p className={styles.title}>Участники</p>
  <div className={styles.wrapper}>
    {props.members.length > 0 && !props.loading &&
    props.members.slice(0, 8).map(user=> {
      return(
        <div className={styles.user} key={user.id}>
          <UserPic image={getUserImageSource(user)} size={60}/>
          <p className={styles.name}>{user.firstName}</p>
        </div>
      )
    })
    ||
    props.loading && <Spinner size={24} color={colors.blue}/>
    ||
    <p className={'empty'}>Нет участников</p>
  }
  </div>

  
  </div>)
}