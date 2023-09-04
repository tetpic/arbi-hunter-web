import { useState } from 'react'
import ItemNavigation from '../../ItemNavigation'
import ChangePassword from './Password'
import styles from './index.module.scss'
import PersonalInformation from './PersonalInformation'

interface Props {
}

enum PersonalNavigation {
  Personal = 'Личная информация',
  Password = 'Изменить пароль'
}




export default function Personal(props: Props) {

  const [activeItem, setActiveItem] = useState<PersonalNavigation>(PersonalNavigation.Personal)
  const items = Object.values(PersonalNavigation).map(el=> el)

  return (
    <div className={styles.root}> 
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