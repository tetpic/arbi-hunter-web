import { useState } from 'react'
import ItemNavigation from '../../ItemNavigation'
import styles from './index.module.scss'

interface Props {
}

enum ReviewsNavigation {
  Any = 'Любые отклики',
  Invite = 'Приглашение',
  Consideration = 'На рассмотрении',
  Reject = 'Отказ',
}

export default function Feedbacks(props: Props) {

  const [activeItem, setActiveItem] = useState<ReviewsNavigation>(ReviewsNavigation.Any)
  const items = Object.values(ReviewsNavigation)

  return (<div className={styles.root}> 
     <ItemNavigation activeItem={activeItem} items={items} onClick={(n)=>setActiveItem(n)}/>
  </div>)
}