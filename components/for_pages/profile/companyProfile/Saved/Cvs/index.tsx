import CvCard from 'components/ui/CvCard'
import { useCvContext } from 'context/cv_state'
import Scrollbars from 'rc-scrollbars'
import { useEffect } from 'react'
import styles from './index.module.scss'

interface Props {
}

export default function SavedCVs() {

  const cvContext = useCvContext()

  useEffect(()=>{
    
    if(!cvContext.savedCvs||cvContext.savedCvs.length === 0){
      cvContext.setSavedCvs()
    }
  }, [])

  return (
    <div className={styles.root}> 
    <Scrollbars universal style={{height: '100%'}}>
      <div className={styles.wrapper}>
        {cvContext.savedCvs&&cvContext.savedCvs.map(el => {
          return <CvCard key={el.id} cv={el}/>
        })}
      </div>
    </Scrollbars>
  </div>
  )
}