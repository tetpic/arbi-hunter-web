import CvCard from 'components/ui/CvCard'
import { useUserContext } from 'context/user_state'
import { useEffect } from 'react'
import styles from './index.module.scss'

interface Props {
}

export default function SavedCVs() {

  const userContext = useUserContext()

  useEffect(()=>{
    userContext.setSavedCvs()
  }, [])

  return (
    <div className={styles.root}> 
    {userContext.savedCvs&&userContext.savedCvs.map(el => {
      return <CvCard key={el.id} cv={el}/>
    })}
  </div>
  )
}