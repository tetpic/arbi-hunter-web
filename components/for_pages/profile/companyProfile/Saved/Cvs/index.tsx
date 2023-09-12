import CvCard from 'components/ui/CvCard'
import { useUserContext } from 'context/user_state'
import Scrollbars from 'rc-scrollbars'
import { useEffect } from 'react'
import styles from './index.module.scss'

interface Props {
}

export default function SavedCVs() {

  const userContext = useUserContext()

  useEffect(()=>{
    if(!userContext.savedCvs||userContext.savedCvs.length < 0){
      userContext.setSavedCvs()
    }
  }, [userContext.savedCvs])

  return (
    <div className={styles.root}> 
    <Scrollbars universal style={{height: '100%'}}>
      <div className={styles.wrapper}>
        {userContext.savedCvs&&userContext.savedCvs.map(el => {
          return <CvCard key={el.id} cv={el}/>
        })}
      </div>
    </Scrollbars>
  </div>
  )
}