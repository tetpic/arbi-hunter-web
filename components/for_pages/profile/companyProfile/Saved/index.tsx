import { useState } from 'react'
import ItemNavigation from '../../ItemNavigation'
import SavedCourses from './Courses'
import SavedCVs from './Cvs'
import styles from './index.module.scss'
import SavedMedia from './Media'

interface Props {
}

enum SavedNavigation {
  CVS = 'Резюме',
  Courses = 'Курсы',
  Media = 'Медиа'
}


export default function Saved(props: Props) {

  const [activeItem, setActiveItem] = useState<SavedNavigation>(SavedNavigation.CVS)
  const items = Object.values(SavedNavigation).map(el=> el)

  return (<div className={styles.root}> 
    <ItemNavigation activeItem={activeItem} items={items} onClick={(n)=>setActiveItem(n)}/>
    {
      activeItem===SavedNavigation.CVS&& <SavedCVs/>
      ||
      activeItem===SavedNavigation.Courses&&<SavedCourses/>
      ||
      activeItem===SavedNavigation.Media&&<SavedMedia/>
    }
  </div>)
}