import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useUserContext } from './user_state'
import { useResize } from 'components/hooks/useResize'
import { ProfileType } from 'data/interfaces/IRegistration'
import { NavigationSet } from 'types/types'
import ShopSvg from 'components/svg/ShopSvg'
import FolderSvg from 'components/svg/FolderSvg'
import SettingsSvg from 'components/svg/SettingsSvg'
import EditMessageSvg from 'components/svg/EditMessageSvg'
import UsersSvg from 'components/svg/UsersSvg'
import HeartSvg from 'components/svg/HeartSvg'
import PencilSvg from 'components/svg/PencilSvg'
import useTranslation from 'next-translate/useTranslation'


export enum ProfilePages {
  Personal = 'personal',
  Edit = 'edit',
  Saved='saved',
  Cvs = 'cvs',
  Vacancies = 'vacancies',
  Shop = 'shop',
  FeedBacks = 'feedbacks',
  Managers = 'managers',
  Patterns = 'patterns',
  UserEditor = 'editor'
}

interface Props {
  children: React.ReactNode
  page?: string
}



interface IState {
  pager: (p: ProfilePages) => void
  page: ProfilePages
  availablePages: ProfilePages[]
  navSet: () => NavigationSet<ProfilePages>[]
  showNav: boolean
  setShowNav: Dispatch<SetStateAction<boolean>>
  profileType: ProfileType

}


const ProfilePageContext = createContext<Partial<IState>>({})



export function ProfilePageWrapper(props: Props) {
  const {t} = useTranslation()
  const router = useRouter()
  const userContext = useUserContext()
  const profileType = userContext?.currentProfile?.profileType||null
  const {isTabletWidth} = useResize()
  const [page, setPage] = useState<ProfilePages>(props.page as ProfilePages||ProfilePages.Saved)
  const [showNav, setShowNav] = useState<boolean>(isTabletWidth)

  const pager = (p: ProfilePages) => {
    setPage(p)    
  }

  const availablePages = ((): ProfilePages[] => {
    switch(profileType) {
      case ProfileType.Employee: 
      return [
        ProfilePages.Personal,
        ProfilePages.Edit,
        ProfilePages.Saved,
        ProfilePages.Cvs,
        ProfilePages.Shop,
        ProfilePages.FeedBacks,

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


  const navSet = useCallback(((): NavigationSet<ProfilePages>[] => {
    let result:{name: string, type: ProfilePages, icon: JSX.Element}[]  = []
    result = Object.values(availablePages).map(page => {
      switch(page) {
        case ProfilePages.Shop:
        return {name: t('profile_title_shop'), type: page, icon: <ShopSvg/>}

        case ProfilePages.Vacancies:
        return {name: t('profile_title_vacancies'), type: page, icon: <FolderSvg/>}

        case ProfilePages.Edit:
        return {name: t('profile_title_editProfile'), type: page, icon: <SettingsSvg/>}

        case ProfilePages.FeedBacks:
        return {name: t('profile_title_feedbacks'), type: page, icon: <EditMessageSvg/>}

        case ProfilePages.Cvs:
        return {name: t('profile_title_myCVs'), type: page, icon: <FolderSvg/>}

        case ProfilePages.Managers:
        return {name: t('profile_title_managers'), type: page, icon: <UsersSvg/>}

        case ProfilePages.Saved:
        return {name: t('profile_title_saved'), type: page, icon: <HeartSvg/>}

        case ProfilePages.Patterns:
        return {name: t('profile_title_patterns'), type: page, icon: <EditMessageSvg/>}

        case ProfilePages.Personal:
        return {name: t('profile_title_personalInfo'), type: page, icon: <PencilSvg/>}
      }
    })
    return result
  } ), [page])

  useEffect(()=>{    
    pager(page)
    router.replace({
      query: { ...router.query, page: page },
    })
  }, [page])


  const value: IState = {
    pager,
    page,
    availablePages,
    navSet,
    showNav,
    setShowNav,
    profileType
  }

  return (
    <ProfilePageContext.Provider value={value}>
      {props.children}
    </ProfilePageContext.Provider>
  )
}

export function useProfilePageContext() {
  return useContext(ProfilePageContext)
}
