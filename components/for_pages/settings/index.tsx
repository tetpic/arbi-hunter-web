import { useState } from 'react'
import styles from './index.module.scss'
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

interface Props {
}

enum SettingsNavigation {
  Personal = 'personal',
  Notifications = 'notifications',
  BlackList = 'blackList',
  Access = 'access',
  SiteSettings = 'siteSettings',
  Patterns = 'patterns'
}

function translatePersonalNavigation(p: SettingsNavigation) {
  switch(p) {
    case SettingsNavigation.Personal:
      return 'Личная информация'
    case SettingsNavigation.Notifications: 
      return 'Уведомления'
    case SettingsNavigation.BlackList:
      return 'Черный список'
    case SettingsNavigation.Access:
      return 'Настройки доступа'
    case SettingsNavigation.SiteSettings:
      return 'Настройки сайта'
    case SettingsNavigation.Patterns:
      return 'Шаблоны'
  }
}


export default function SettingsPage(props: Props) {
  const [activeItem, setActiveItem] = useState<SettingsNavigation>(SettingsNavigation.Personal)
  const userContext = useUserContext()
  const router = useRouter()

  const employeeItems = [
    SettingsNavigation.Personal, 
    SettingsNavigation.Notifications,
    SettingsNavigation.BlackList,
    SettingsNavigation.Access,
    SettingsNavigation.SiteSettings,
  ]

  const hirerItems = [
    SettingsNavigation.Personal, 
    SettingsNavigation.Notifications,
    SettingsNavigation.Patterns,
    SettingsNavigation.Access,
    SettingsNavigation.SiteSettings,
  ]

  const items = (userContext.currentProfile?.profileType === ProfileType.Hirer?hirerItems:employeeItems).map(el=> {return {name: translatePersonalNavigation(el), type: el}})

  const getComponent = () => {
    switch(activeItem) {
      case SettingsNavigation.Personal:
        return <PersonalInformation/>
      case SettingsNavigation.Notifications:
        return <Notifications/>
      case SettingsNavigation.BlackList:
        return <BlackList/>
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
        <TitleForSection title='Настройки' onBackClick={()=>router.back()}/>
      }
      <ItemNavigation activeItem={activeItem} onClick={(n)=>setActiveItem(n)} items={items} className={styles.itemNavigation} />
      <div className={styles.contentWrapper}>
      {getComponent()}
      </div>
    </div>
  )
}