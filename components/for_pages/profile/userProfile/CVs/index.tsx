import { useUserContext } from 'context/user_state'
import { ICV } from 'data/interfaces/ICV'
import { useEffect, useState } from 'react'
import ItemNavigation from '../../ItemNavigation'
import CVItem from './CvItem'
import styles from './index.module.scss'

interface Props {
}

enum CVNavigation {
  Active = 'Активные',
  Drafts = 'Черновики',
  Archive = 'Архив',
}

export default function CVs(props: Props) {
  const userContext = useUserContext()
  const [activeItem, setActiveItem] = useState<CVNavigation>(CVNavigation.Active)
  const items = Object.values(CVNavigation)
  const [filteredCvs, setFilteredCvs] = useState<ICV[]>([])

  useEffect(()=>{
    userContext.setSavedCvs()
  }, [])

  useEffect(()=>{
    setFilteredCvs(userContext?.savedCvs)
  }, [userContext.savedCvs])

  useEffect(()=>{
    switch(activeItem) {
      case CVNavigation.Active :
        setFilteredCvs(userContext?.savedCvs.filter(el => el.published === true))
        break
      case CVNavigation.Archive: 
        setFilteredCvs(userContext?.savedCvs.filter(el => el.published === false))
        break
      case CVNavigation.Drafts: 
        setFilteredCvs(userContext?.savedCvs.filter(el => el.published === false))
        break
    }
  }, [activeItem])



  return (
    <div className={styles.root}> 
      <ItemNavigation activeItem={activeItem} items={items} onClick={(n)=>setActiveItem(n)}/>
      {
      filteredCvs?.length > 0 && filteredCvs.map((el, index) => <CVItem cv={el} key={index}/>)
      ||
      <p className={styles.empty}>Нет созданных резюме</p>
      }
    </div>
  )

}