import styles from './index.module.scss'

import classNames from 'classnames'
import { ProfileType } from 'data/interfaces/IRegistration'
import CompanyProfile from './companyProfile'
import UserProfile from './userProfile'
import { ProfilePages, useProfilePageContext } from 'context/profile_page_state'
import Button from 'components/ui/Button'
import { useCharacterContext } from 'context/character_state'
import { useAppContext } from 'context/state'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AppTheme, ModalType } from 'types/enums'
import { CharacterCartModalArgs } from '@/components/modals/CharacterCartModal'
import NotificationSvg from '@/components/svg/NotificationSvg'
import { colors } from 'styles/variables'
import useTranslation from 'next-translate/useTranslation'


export default function Profile() {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const profilePageContext = useProfilePageContext()
  const characterContext = useCharacterContext()
  const {showNav, profileType, pager, page, setShowNav, navSet} = profilePageContext
  const router = useRouter()
  const {t} = useTranslation()

  const onSaveHandler = () => {
    if(!isTabletWidth) {
      characterContext.saveCurrentSet()
    }
    else {
      appContext.showBottomSheet<CharacterCartModalArgs>(ModalType.CharacterCartModal, {
        onSave: ()=>{
          characterContext.saveCurrentSet()
          appContext.hideBottomSheet()
        },
        choosenItems: characterContext.choosenItems
      }, 0.7)
    }
  }

  const saveCharButton = (<>
  <Button 
  styleType={['icon', 'black']}
  altStyleType={['icon', 'white']}
  >
    <NotificationSvg color={appContext.theme === AppTheme.Light && colors.black} />
  </Button>
  </>)

  useEffect(()=>{
    pager(router.query?.page as ProfilePages)
  }, [router])



  return ( 
    <div className={classNames(styles.root)} id={'scrollable'}>
      {showNav && isTabletWidth &&
        <TitleForSection title={t('profile_settings')} onBackClick={()=>router.back()}/>
      }
      {
        profileType === ProfileType.Employee && !showNav &&
          <UserProfile 
          titleButton={page===ProfilePages.Edit && profileType === ProfileType.Employee && isTabletWidth&& saveCharButton}  
          currentPage={page} 
          navSet={navSet()} 
          onBackClick={()=>setShowNav(true)}
          /> 
        ||
        profileType === ProfileType.Hirer && !showNav &&
        <CompanyProfile  currentPage={page} navSet={navSet()} onBackClick={()=>setShowNav(true)}/>
      }
    </div>
  )
}