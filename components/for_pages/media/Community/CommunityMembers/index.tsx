import Spinner from 'components/ui/Spinner'
import UserPic from 'components/ui/UserPic'
import { useCommunityContext } from 'context/community_state'
import { useEffect, useState } from 'react'
import { colors } from 'styles/variables'
import { FILES } from 'types/constants'
import styles from './index.module.scss'

interface Props {
}

export default function CommunityMembers(props: Props) {
  const communityContext = useCommunityContext()
  const [loading, setLoad] = useState<boolean>(true)

  useEffect(()=>{
    communityContext.setCommunityMembers(1)
    .then(_=> {
        setLoad(false)
      }
    )
  }, [])



  return (<div className={styles.root}> 
  <p className={styles.title}>Участники</p>
  <div className={styles.wrapper}>
    {communityContext.communityMembers.size > 0 && !loading &&
    [...communityContext.communityMembers.values()].slice(0, 8).map(user=> {
      return(
        <div className={styles.user}>
          <UserPic image={user.image&&FILES+user.image.source} size={60}/>
          <p className={styles.name}>{user.firstName}</p>
        </div>
      )
    })
    ||
    loading && <Spinner size={24} color={colors.yellow}/>
    ||
    <p className={'empty'}>Нет участников</p>
    }
  </div>

  
  </div>)
}