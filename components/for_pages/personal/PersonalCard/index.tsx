import styles from './index.module.scss'

import { useUserContext } from 'context/user_state'
import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import RatingLine from 'components/ui/RatingLine'

interface Props {
}

export default function PersonalCard(props: Props) {
  const userContext = useUserContext()

  return (<div className={styles.root}> 
    <UserPic className={styles.userPic} image={userContext.currentProfile.image && FILES + userContext.currentProfile.image.source} size={188}/>
    <p className={styles.name}>{userContext.currentProfile?.company||userContext.currentProfile.firstName + ' ' + userContext.currentProfile.lastName}</p>
    <div className={styles.rating}>
     <p className={styles.ratingValue}>4.0</p>
     <RatingLine rating={4}/>
     <p className={styles.ratingCount}>23 отзыва</p>
    </div>
  </div>)
}