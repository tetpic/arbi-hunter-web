import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import VacanciesActive from './Active'
import VacanciesInactive from './Inactive'
import ItemNavigation from '@/components/ui/ItemNavigation'
import { useVacancyContext } from 'context/vacancy_state'
import { useTariffContext } from 'context/tariff_state'
import { useUserContext } from 'context/user_state'
import { ModalType, PurchaseType } from 'types/enums'
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import Title from '@/components/ui/TitleForSection'
import { useAppContext } from 'context/state'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/ui/SearchBar'
import LoupeSvg from '@/components/svg/LoupeSvg'
import PlusSvg from '@/components/svg/PlusSvg'
import DotSvg from '@/components/svg/DotSvg'
import { colors } from 'styles/variables'
import { SearchModalArgs } from '@/components/modals/SearchModal'
import { getCategoryName } from 'utils/helpers'

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
  const {t, lang} = useTranslation()
  const vacancyContext = useVacancyContext()
  const tariffContext = useTariffContext()
  const userContext = useUserContext()
  const router = useRouter()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  useEffect(()=>{
    vacancyContext.setVacancies()
    tariffContext.setPackets([PurchaseType.VacancyTariff])
  }, [])

  const [activeItem, setActiveItem] = useState<VacanciesNavigation>(VacanciesNavigation.Active)
  const items = Object.values(VacanciesNavigation).map(el=> {return {name: translate(el, t), type: el}})

  const onSearch = (data?: string) => {
    isTabletWidth && appContext.showModal<SearchModalArgs>(ModalType.SearchModal, {
      onSearch: (s) => {
        vacancyContext.setSearchString(s)
      },
      placeholder: t('search_byName'),
      suggestions: [...new Set(vacancyContext.savedVCs.map(el=> getCategoryName(el.categories[0], lang))).values()],
      initialValue: vacancyContext.searchString
    })
    if(data) {
      vacancyContext.setSearchString(data)
    }
  }

  return (<div className={styles.root}> 
    <Title 
    title={t('vacancies_myVacancies')} 
    onBackClick={router.back} 
    rightButton={isTabletWidth &&
      <div className={styles.buttonsWrapper}>
        <Button styleType={['icon', 'black']} altStyleType={['icon', 'white', 'invertSvg']} onClick={()=>router.push('/create/vacancy')}><PlusSvg/></Button>
        <Button styleType={['icon', 'black']} altStyleType={['icon', 'white', 'invertSvg']} onClick={()=>onSearch()}><LoupeSvg/>{vacancyContext.searchString&&<DotSvg className={styles.dot} color={colors.green}/>}</Button>
      </div>
    }
    />
    
    {!isTabletWidth &&
      <SearchBar 
      key={'vacancySearchbar'}
      className={styles.search} 
      placeholder={t('vacancies_searchInMy')} 
      onSubmit={(data)=>onSearch(data.search)}
      />
    }

    <ItemNavigation onAllWidth={isTabletWidth} activeItem={activeItem} items={items} onClick={(v) => setActiveItem(v)}/> 
    {
      activeItem === VacanciesNavigation.Active && <VacanciesActive/>
      ||
      activeItem === VacanciesNavigation.Archive && <VacanciesInactive type='archive'/>
      ||
      activeItem === VacanciesNavigation.Drafts && <VacanciesInactive type='drafts'/>
    }
  </div>)
}