import { useCvContext } from 'context/cv_state'
import { ICV } from 'data/interfaces/ICV'
import { useEffect, useState } from 'react'
import CVItem from './CvItem'
import styles from './index.module.scss'
import Spacer from 'components/ui/Spacer'
import ItemNavigation from '@/components/ui/ItemNavigation'
import { useUserContext } from 'context/user_state'
import { getUserImageSource } from 'utils/helpers'

interface Props {
}

enum CVNavigation {
  Active = 'active',
  Drafts = 'drafts',
  Archive = 'archive',
}

function translate (n: CVNavigation) {
  switch(n) {
    case CVNavigation.Active:
      return 'Активные'
    case CVNavigation.Drafts:
      return 'Черновики'
    case CVNavigation.Archive:
      return 'Архив'
  }
}

export default function CVs(props: Props) {
  const cvContext = useCvContext()
  const userContext = useUserContext()
  const [activeItem, setActiveItem] = useState<CVNavigation>(CVNavigation.Active)
  const items = Object.values(CVNavigation).map(el=> {return {name: translate(el), type: el}})
  const [filteredCvs, setFilteredCvs] = useState<ICV[]>([])

  useEffect(()=>{
    cvContext.setSavedCvs()
  }, [])

  useEffect(()=>{
    setFilteredCvs(cvContext?.savedCvs)
  }, [cvContext.savedCvs])

  useEffect(()=>{
    switch(activeItem) {
      case CVNavigation.Active :
        setFilteredCvs(cvContext?.savedCvs.filter(el => el.published === true && el.moderationStatus === 'approved'))
        break
      case CVNavigation.Archive: 
        setFilteredCvs(cvContext?.savedCvs.filter(el => el.published === false && el.moderationStatus === 'approved'))
        break
      case CVNavigation.Drafts: 
        setFilteredCvs(cvContext?.savedCvs.filter(el => el.moderationStatus !== 'approved'))
        break
    }
  }, [activeItem, cvContext.savedCvs])



  return (
    <div className={styles.root}> 
      <ItemNavigation activeItem={activeItem} items={items} onClick={(n)=>setActiveItem(n)}/>
      {
      filteredCvs?.length > 0 && 
      filteredCvs.map((el, index) => <CVItem image={getUserImageSource(userContext.currentProfile)}  isLast={index===filteredCvs.length -1} cv={el} key={index}/>)
      ||
      <p className={'empty'}>Нет созданных резюме</p>
      }
      <Spacer basis={24}/>
    </div>
  )

}