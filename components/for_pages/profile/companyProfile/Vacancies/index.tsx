import { useEffect, useState } from 'react'
import VacanciesActive from './Active'
import styles from './index.module.scss'
import VacanciesInactive from './Inactive'
import ItemNavigation from '@/components/ui/ItemNavigation'
import { useVacancyContext } from 'context/vacancy_state'
import { useTariffContext } from 'context/tariff_state'
import { useUserContext } from 'context/user_state'
import { PurchaseType } from 'types/enums'
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

enum VacanciesNavigation {
  Active =  'active',
  Drafts = 'drafts',
  Archive = 'archive',
}

function translate (n: VacanciesNavigation, t:Translate) {
  switch(n) {
    case VacanciesNavigation.Active:
      return t('profile_active')
    case VacanciesNavigation.Archive:
      return t('profile_archive')
    case VacanciesNavigation.Drafts:
      return t('profile_drafts')
  }
}

export default function Vacancies(props: Props) {
  const {t} = useTranslation()
  const vacancyContext = useVacancyContext()
  const tariffContext = useTariffContext()
  const userContext = useUserContext()

  useEffect(()=>{
    vacancyContext.setVacancies()
    tariffContext.setPackets([PurchaseType.VacancyTariff])
  }, [])

  const [activeItem, setActiveItem] = useState<VacanciesNavigation>(VacanciesNavigation.Active)
  const items = Object.values(VacanciesNavigation).map(el=> {return {name: translate(el, t), type: el}})


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