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


export default function Profile() {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const profilePageContext = useProfilePageContext()
  const characterContext = useCharacterContext()
  const {showNav, profileType, pager, page, setShowNav, navSet} = profilePageContext
  const router = useRouter()

  const saveCharButton = (<>
  <Button 
  isProcess={characterContext.savingProcess}  
  disabled={characterContext.savingProcess?true:Boolean(!characterContext.dataBaseBlob)} 
  onClick={()=>characterContext.saveCurrentSet()}  
  className={styles.saveCharButton}>
    {isTabletWidth?'Готово':'Сохранить'}
  </Button>
  </>)

  useEffect(()=>{
    pager(router.query?.page as ProfilePages)
  }, [router])



  return ( 
    <div className={classNames(styles.root)} id={'scrollable'}>
      {showNav && isTabletWidth &&
        <TitleForSection title={'Настройки профиля'} onBackClick={()=>router.back()}/>
      }
      {
        profileType === ProfileType.Employee && !showNav &&
          <UserProfile titleButton={page===ProfilePages.Edit && profileType === ProfileType.Employee && isTabletWidth&& saveCharButton}  currentPage={page} navSet={navSet()} onBackClick={()=>setShowNav(true)}/> 
        ||
        profileType === ProfileType.Hirer && !showNav &&
        <CompanyProfile  currentPage={page} navSet={navSet()} onBackClick={()=>setShowNav(true)}/>
      }
      {/* {((showNav && isTabletWidth) || !isTabletWidth) &&
        <Navigation 
        wrapperClassName={styles.nav} 
        bottomItem={page===ProfilePages.Edit && profileType === ProfileType.Employee && !isTabletWidth&& saveCharButton} 
        currentPage={page} 
        navSet={navSet()} 
        setPage={(p)=> {router.push(`/profile?page=${p}`)}} 
        onClickHandler={()=>setShowNav(false)}/>
      } */}
    </div>
  )
}