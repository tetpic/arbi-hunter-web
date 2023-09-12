import classNames from 'classnames'
import EditMessageSvg from 'components/svg/EditMessageSvg'
import FolderSvg from 'components/svg/FolderSvg'
import HeartSvg from 'components/svg/HeartSvg'
import PencilSvg from 'components/svg/PencilSvg'
import SettingsSvg from 'components/svg/SettingsSvg'
import ShopSvg from 'components/svg/ShopSvg'
import UsersSvg from 'components/svg/UsersSvg'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useCallback, useEffect, useState } from 'react'
import CompanyProfile from './companyProfile'
import ProfileNavigation from './Navigation'
import UserProfile from './userProfile'
import styles from './index.module.scss'
import { useRouter } from 'next/router'
import { useResize } from 'components/hooks/useResize'

interface Props {
  page?: string
}

export enum ProfilePages {
  Personal = 'personal',
  Edit = 'edit',
  Saved='saved',
  Cvs = 'cvs',
  Vacancies = 'vacancies',
  Shop = 'shop',
  FeedBacks = 'feedbacks',
  Managers = 'managers',
  Patterns = 'patterns'
}

export interface NavigationSet {
  name: string, 
  type: ProfilePages, 
  icon: JSX.Element
}

export default function Profile(props: Props) {

  const router = useRouter()
  const {currentProfile} = useUserContext()
  const {isTabletWidth} = useResize()
  const [page, setPage] = useState<ProfilePages>(props.page as ProfilePages||ProfilePages.Saved)
  const [showNav, setShowNav] = useState<boolean>(isTabletWidth)

  const pager = (p: ProfilePages) => {
    setPage(p)    
  }

  const availablePages = ((): ProfilePages[] => {
    switch(currentProfile.profileType) {
      case ProfileType.Employee: 
      return [
        ProfilePages.Saved,
        ProfilePages.Cvs,
        ProfilePages.Shop,
        ProfilePages.FeedBacks
      ]
      case ProfileType.Hirer: 
      return [
        ProfilePages.Personal, 
        ProfilePages.Managers,
        ProfilePages.Saved,
        ProfilePages.Vacancies,
        ProfilePages.Shop,
        ProfilePages.Patterns
      ]
    }
  })()


  const navSet = useCallback(((): NavigationSet[] => {
    let result:{name: string, type: ProfilePages, icon: JSX.Element}[]  = []
    result = Object.values(availablePages).map(page => {
      switch(page) {
        case ProfilePages.Shop:
        return {name: 'Магазин', type: page, icon: <ShopSvg/>}

        case ProfilePages.Vacancies:
        return {name: 'Вакансии', type: page, icon: <FolderSvg/>}

        case ProfilePages.Edit:
        return {name: 'Редактировать профиль', type: page, icon: <SettingsSvg/>}

        case ProfilePages.FeedBacks:
        return {name: 'Отклики', type: page, icon: <EditMessageSvg/>}

        case ProfilePages.Cvs:
        return {name: 'Мои резюме', type: page, icon: <FolderSvg/>}

        case ProfilePages.Managers:
        return {name: 'Менеджеры вакансий', type: page, icon: <UsersSvg/>}

        case ProfilePages.Saved:
        return {name: 'Сохранённое', type: page, icon: <HeartSvg/>}

        case ProfilePages.Patterns:
        return {name: 'Шаблоны писем', type: page, icon: <EditMessageSvg/>}

        case ProfilePages.Personal:
        return {name: 'Личная информация', type: page, icon: <PencilSvg/>}
      }
    })
    return result
  } ), [page])

  const navHandler = () => {

  }


  useEffect(()=>{    
    pager(page)
    router.replace({
      query: { ...router.query, page: page },
    })
  }, [page])

  return ( 
    <div className={classNames(styles.root)}>
      {
        currentProfile.profileType === ProfileType.Employee && !showNav &&
        <UserProfile  currentPage={page} navSet={navSet()} onBackClick={()=>setShowNav(true)}/> 
        ||
        currentProfile.profileType === ProfileType.Hirer && !showNav &&
        <CompanyProfile currentPage={page} navSet={navSet()} onBackClick={()=>setShowNav(true)}/>
      }
      {((showNav && isTabletWidth) || !isTabletWidth) &&
        <ProfileNavigation currentPage={page} navSet={navSet()} setPage={pager} onClickHandler={()=>setShowNav(false)}/>
      }
    </div>
  )
}