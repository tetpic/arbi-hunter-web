import styles from './index.module.scss'
import { useState } from 'react'
import ChangePassword from '../../settings/Password'
import PersonalInformation from '../../settings/PersonalInformation'
import ItemNavigation from '@/components/ui/ItemNavigation'
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'



enum PersonalNavigation {
  Personal = 'personal',
  Password = 'password'
}

function translatePersonalNavigation(p: PersonalNavigation, t: Translate) {
  switch(p) {
    case PersonalNavigation.Personal:
      return t('personal_personalInfo')
    case PersonalNavigation.Password: 
      return t('personal_changePassword')
  }
}

export default function Personal() {
  const {t} = useTranslation()

  const [activeItem, setActiveItem] = useState<PersonalNavigation>(PersonalNavigation.Personal)
  const items = Object.values(PersonalNavigation).map(el=> {return {name: translatePersonalNavigation(el, t), type: el}})

  return (
    <div className={styles.root}> 
      {/* {userContext?.currentProfile?.profileType === ProfileType.Hirer &&
        <Buildings/>
        ||
        <Rooms/>
      } */}
      <ItemNavigation activeItem={activeItem} onClick={(n)=>setActiveItem(n)} items={items} />
      <div className={styles.contentWrapper}>
      {
        activeItem === PersonalNavigation.Password&&
        <ChangePassword/>
        ||
        activeItem === PersonalNavigation.Personal&&
        <PersonalInformation/>
      }
      </div>
    </div>
  )
}