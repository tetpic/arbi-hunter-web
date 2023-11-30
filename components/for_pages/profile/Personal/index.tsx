import styles from './index.module.scss'
import { useState } from 'react'
import ItemNavigation from '../ItemNavigation'
import ChangePassword from './Password'
import PersonalInformation from './PersonalInformation'
import Rooms from './Rooms'
import Buildings from './Buildings'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'



enum PersonalNavigation {
  Personal = 'personal',
  Password = 'password'
}

function translatePersonalNavigation(p: PersonalNavigation) {
  switch(p) {
    case PersonalNavigation.Personal:
      return 'Личная информация'
    case PersonalNavigation.Password: 
      return 'Изменить пароль'
  }
}

export default function Personal() {
  const userContext = useUserContext()

  const [activeItem, setActiveItem] = useState<PersonalNavigation>(PersonalNavigation.Personal)
  const items = Object.values(PersonalNavigation).map(el=> {return {name: translatePersonalNavigation(el), type: el}})

  return (
    <div className={styles.root}> 
      {userContext.currentProfile.profileType === ProfileType.Hirer &&
        <Buildings/>
        ||
        <Rooms/>
      }
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