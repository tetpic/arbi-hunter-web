import { useCvContext } from 'context/cv_state'
import Scrollbars from 'rc-scrollbars'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import CvItem from 'components/ui/CvItem'
import { ICV } from 'data/interfaces/ICV'
import Spinner from 'components/ui/Spinner'

interface Props {
}

export default function SavedCVs() {

  const cvContext = useCvContext()
  const [load, setLoading ] = useState<boolean>(true)

  useEffect(()=>{
    // if(!cvContext.savedCvs||cvContext.savedCvs.length === 0){
      cvContext.setSavedCvs()
      .then(_=>{
        setLoading(false)
      })
    // }
  }, [])

  const onChangeItem = (c: ICV) => {
    
    cvContext.removeCvfromSaved(c.id)
  }

  return (
    <div className={styles.root}> 
    <Scrollbars universal style={{height: '100%'}}>
      <div className={styles.wrapper}>
        {!load && cvContext.savedCvs.length > 0&&cvContext.savedCvs.map(el => {
          return <CvItem onChangeItem={()=> onChangeItem(el)} cv={el} key={el.id}/>
        })
        ||
        load && <Spinner size={24}/>
        ||
        <p className='empty'>Нет сохраненных резюме</p>
        }
      </div>
    </Scrollbars>
  </div>
  )
}