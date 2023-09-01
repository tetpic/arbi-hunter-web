import { useState } from 'react'
import ItemNavigation from '../../ItemNavigation'
import styles from './index.module.scss'

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
    </div>
  )
}