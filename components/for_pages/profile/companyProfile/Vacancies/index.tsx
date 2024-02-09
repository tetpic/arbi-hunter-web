import { useState } from 'react'
import ItemNavigation from '../../ItemNavigation'
import VacanciesActive from './Active'
import styles from './index.module.scss'
import VacanciesInactive from './Inactive'

interface Props {
}

enum VacanciesNavigation {
  Active =  'active',
  Drafts = 'drafts',
  Archive = 'archive',
}

function translate (n: VacanciesNavigation) {
  switch(n) {
    case VacanciesNavigation.Active:
      return 'Активные'
    case VacanciesNavigation.Archive:
      return 'Архив'
    case VacanciesNavigation.Drafts:
      return 'Черновики'
  }
}

export default function Vacancies(props: Props) {

  const [activeItem, setActiveItem] = useState<VacanciesNavigation>(VacanciesNavigation.Active)
  const items = Object.values(VacanciesNavigation).map(el=> {return {name: translate(el), type: el}})


  return (<div className={styles.root}> 
    <ItemNavigation activeItem={activeItem} items={items} onClick={(v) => setActiveItem(v)}/> 
    {
      activeItem === VacanciesNavigation.Active && <VacanciesActive/>
      ||
      activeItem === VacanciesNavigation.Archive && <VacanciesInactive type='archive'/>
      ||
      activeItem === VacanciesNavigation.Drafts && <VacanciesInactive type='drafts'/>
    }
  </div>)
}