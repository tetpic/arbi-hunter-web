import { useState } from 'react'
import SavedMedia from '../../Media'
import ItemNavigation from '../../ItemNavigation'
import styles from './index.module.scss'
import SavedVacancies from './Vacancies'
import SavedCourses from '../../companyProfile/Courses'

interface Props {
}

enum SavedNavigation {
  Vacancies = 'vacancies',
  Courses = 'courses',
  Media = 'media'
}

function translate (n: SavedNavigation) {
  switch(n) {
    case SavedNavigation.Vacancies:
      return 'Вакансии'
    case SavedNavigation.Courses:
      return 'Курсы'
    case SavedNavigation.Media:
      return 'Медиа'
  }
}

export default function Saved(props: Props) {

  const [activeItem, setActiveItem] = useState<SavedNavigation>(SavedNavigation.Vacancies)
  const items = Object.values(SavedNavigation).map(el=> {return {name: translate(el), type: el}})

  return (
    <div className={styles.root}> 
      <ItemNavigation activeItem={activeItem} items={items} onClick={(n)=>setActiveItem(n)}/>
      <div className={styles.wrapper}>
        {
          activeItem===SavedNavigation.Vacancies&& <SavedVacancies/>
          ||
          activeItem===SavedNavigation.Courses&&<SavedCourses/>
          ||
          activeItem===SavedNavigation.Media&&<SavedMedia/>
        }
      </div>
    </div>
  )
}