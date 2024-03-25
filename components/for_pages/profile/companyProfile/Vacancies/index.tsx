import { useEffect, useState } from 'react'
import VacanciesActive from './Active'
import styles from './index.module.scss'
import VacanciesInactive from './Inactive'
import ItemNavigation from '@/components/ui/ItemNavigation'
import { useVacancyContext } from 'context/vacancy_state'
import { useTariffContext } from 'context/tariff_state'
import { useUserContext } from 'context/user_state'

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
  const vacancyContext = useVacancyContext()
  const tariffContext = useTariffContext()
  const userContext = useUserContext()

  useEffect(()=>{
    vacancyContext.setVacancies()
    tariffContext.setPackets(userContext.currentProfile)
  }, [])

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