import styles from './index.module.scss'

import { useState } from 'react'
import ItemNavigation from '@/components/ui/ItemNavigation'
import PersonalInformation from './PersonalInformation'
import TitleForSection from '@/components/ui/TitleForSection'
import { useRouter } from 'next/router'
import Notifications from './Notifications'
import BlackList from './BlackList'
import ChangePassword from './Password'
import SiteSettings from './SiteSettings'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import Patterns from './Patterns'
import { VacancyWrapper } from 'context/vacancy_state'
import useTranslation from 'next-translate/useTranslation'
import { Translate } from 'next-translate'
import { CvWrapper } from 'context/cv_state'

interface Props {
}

enum SettingsNavigation {
  Personal = 'personal',
  Notifications = 'notifications',
  BlackListHirer = 'blackListHirer',
  BlackListEmployee = 'blackListEmployee',
  Access = 'access',
  SiteSettings = 'siteSettings',
  Patterns = 'patterns'
}

function translatePersonalNavigation(p: SettingsNavigation, t: Translate, profileType: ProfileType) {
  switch(p) {
    case SettingsNavigation.Personal:
      return t('settings_personal')
    case SettingsNavigation.Notifications: 
      return t('settings_notification')
    case SettingsNavigation.BlackListEmployee:
    case SettingsNavigation.BlackListHirer:
      return profileType === ProfileType.Hirer?t('settings_blackListHirer'):t('settings_blackListEmployee')
    case SettingsNavigation.Access:
      return t('settings_access')
    case SettingsNavigation.SiteSettings:
      return t('settings_site')
    case SettingsNavigation.Patterns:
      return t('settings_patterns')
  }
}


export default function SettingsPage(props: Props) {
  const {t} = useTranslation()
  const [activeItem, setActiveItem] = useState<SettingsNavigation>(SettingsNavigation.Personal)
  const userContext = useUserContext()
  const router = useRouter()

  const employeeItems = [
    SettingsNavigation.Personal, 
    SettingsNavigation.Access,
    SettingsNavigation.SiteSettings,
    SettingsNavigation.Notifications,
    SettingsNavigation.BlackListEmployee,
  ]

  const hirerItems = [
    SettingsNavigation.Personal, 
    SettingsNavigation.Notifications,
    SettingsNavigation.BlackListHirer,
    SettingsNavigation.Patterns,
    SettingsNavigation.Access,
    SettingsNavigation.SiteSettings,
  ]

  const items = (userContext.currentProfile?.profileType === ProfileType.Hirer?hirerItems:employeeItems).map(el=> {return {name: translatePersonalNavigation(el, t, userContext.currentProfile.profileType), type: el}})

  const getComponent = () => {
    switch(activeItem) {
      case SettingsNavigation.Personal:
        return <PersonalInformation/>
      case SettingsNavigation.Notifications:
        return <Notifications/>
      case SettingsNavigation.BlackListEmployee:
        return <VacancyWrapper>
        <BlackList/>
        </VacancyWrapper>
      case SettingsNavigation.BlackListHirer:
        return <CvWrapper>
          <BlackList/>
        </CvWrapper>
      case SettingsNavigation.Access:
        return <ChangePassword/>
      case SettingsNavigation.SiteSettings:
        return <SiteSettings/>
      case SettingsNavigation.Patterns:
        return <Patterns/>
    }
  }

  return (    
    <div className={styles.root}> 
      {
        <TitleForSection className={styles.title} title={t('settings')} onBackClick={()=>router.back()}/>
      }
      <ItemNavigation activeItem={activeItem} onClick={(n)=>setActiveItem(n)} items={items} className={styles.itemNavigation} />
      <div className={styles.contentWrapper}>
      {getComponent()}
      </div>
    </div>
  )
}