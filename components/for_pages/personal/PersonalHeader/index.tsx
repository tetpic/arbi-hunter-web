import styles from './index.module.scss'

import Image from 'next/image'
import { useUserContext } from 'context/user_state'
import { FILES } from 'types/constants'

interface Props {
}

export default function PersonalHeader(props: Props) {
  const userContext = useUserContext()


  return (<div className={styles.root}> 
    <Image src={'/images/cities/moscow.png'} className={styles.background} alt={'moscow'} width={1148} height={300} />
    {userContext.currentProfile.image &&
      <Image src={userContext.currentProfile.image&& FILES+ userContext.currentProfile.image.source} alt={'user Picture'} width={300} height={300}/>
    }
  </div>)
}