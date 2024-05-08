import { useState } from 'react'
import SavedCourses from '../Courses'
import SavedCVs from './Cvs'
import styles from './index.module.scss'
import SavedMedia from '../../Media'
import { MediaWrapper } from 'context/media_state'
import { CharacterWrapper } from 'context/character_state'
import { CoursesWrapper } from 'context/courses_state'
import ItemNavigation from '@/components/ui/ItemNavigation'
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

enum SavedNavigation {
  CVS = 'cvs',
  Courses = 'courses',
  Media = 'media'
}

function translate (n: SavedNavigation, t: Translate) {
  switch(n) {
    case SavedNavigation.CVS:
      return t('cv')
    case SavedNavigation.Courses:
      return t('courses')
    case SavedNavigation.Media:
      return t('media')
  }
}


export default function Saved(props: Props) {
  const {t} = useTranslation()

  const [activeItem, setActiveItem] = useState<SavedNavigation>(SavedNavigation.CVS)
  const items = Object.values(SavedNavigation).map(el=> {return {name: translate(el, t), type: el}})

  return (<div className={styles.root}> 
    <ItemNavigation activeItem={activeItem} items={items} onClick={(n)=>setActiveItem(n)}/>
    {
      activeItem===SavedNavigation.CVS&& <CharacterWrapper><SavedCVs/></CharacterWrapper>
      ||
      activeItem===SavedNavigation.Courses&&<CoursesWrapper><SavedCourses/></CoursesWrapper>
      ||
      activeItem===SavedNavigation.Media&&
      <MediaWrapper>
        <SavedMedia/>
      </MediaWrapper>
    }
  </div>)
}