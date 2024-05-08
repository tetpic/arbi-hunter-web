import styles from './index.module.scss'

import { useState } from 'react'
import SavedMedia from '../../Media'
import SavedVacancies from './Vacancies'
import SavedCourses from '../../companyProfile/Courses'
import { MediaWrapper } from 'context/media_state'
import { CoursesWrapper } from 'context/courses_state'
import ItemNavigation from '@/components/ui/ItemNavigation'
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

enum SavedNavigation {
  Vacancies = 'vacancies',
  Courses = 'courses',
  Media = 'media'
}

function translate (n: SavedNavigation, t: Translate) {
  switch(n) {
    case SavedNavigation.Vacancies:
      return t('profile_title_vacancies')
    case SavedNavigation.Courses:
      return t('courses')
    case SavedNavigation.Media:
      return t('media')
  }
}

export default function Saved(props: Props) {
  const {t} = useTranslation()
  const [activeItem, setActiveItem] = useState<SavedNavigation>(SavedNavigation.Vacancies)
  const items = Object.values(SavedNavigation).map(el=> {return {name: translate(el, t), type: el}})

  return (
    <div className={styles.root}> 
      <ItemNavigation activeItem={activeItem} items={items} onClick={(n)=>setActiveItem(n)}/>
      <div className={styles.wrapper}>
        {
          activeItem===SavedNavigation.Vacancies&& <SavedVacancies/>
          ||
          activeItem===SavedNavigation.Courses&&<CoursesWrapper><SavedCourses/></CoursesWrapper>
          ||
          activeItem===SavedNavigation.Media&&
          <MediaWrapper>
            <SavedMedia/>
          </MediaWrapper>
        }
      </div>
    </div>
  )
}