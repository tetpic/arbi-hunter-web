import { useState } from 'react'
import ItemNavigation from '../../ItemNavigation'
import SavedCourses from '../Courses'
import SavedCVs from './Cvs'
import styles from './index.module.scss'
import SavedMedia from '../../Media'
import { MediaWrapper } from 'context/media_state'
import { CharacterWrapper } from 'context/character_state'
import { CoursesWrapper } from 'context/courses_state'

interface Props {
}

enum SavedNavigation {
  CVS = 'cvs',
  Courses = 'courses',
  Media = 'media'
}

function translate (n: SavedNavigation) {
  switch(n) {
    case SavedNavigation.CVS:
      return 'Резюме'
    case SavedNavigation.Courses:
      return 'Курсы'
    case SavedNavigation.Media:
      return 'Медиа'
  }
}


export default function Saved(props: Props) {

  const [activeItem, setActiveItem] = useState<SavedNavigation>(SavedNavigation.CVS)
  const items = Object.values(SavedNavigation).map(el=> {return {name: translate(el), type: el}})

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