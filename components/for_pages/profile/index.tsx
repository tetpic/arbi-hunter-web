import classNames from 'classnames'
import { ProfileType } from 'data/interfaces/IRegistration'
import CompanyProfile from './companyProfile'
import Navigation from '../../ui/Navigation'
import UserProfile from './userProfile'
import styles from './index.module.scss'
import { useResize } from 'components/hooks/useResize'
import { useProfilePageContext } from 'context/profile_page_state'


export default function Profile() {
  const {isTabletWidth} = useResize()
  const profilePageContext = useProfilePageContext()
  const {showNav, profileType, pager, page, setShowNav, navSet} = profilePageContext

  return ( 
    <div className={classNames(styles.root)}>
      {
        profileType === ProfileType.Employee && !showNav &&
        <UserProfile  currentPage={page} navSet={navSet()} onBackClick={()=>setShowNav(true)}/> 
        ||
        profileType === ProfileType.Hirer && !showNav &&
        <CompanyProfile currentPage={page} navSet={navSet()} onBackClick={()=>setShowNav(true)}/>
      }
      {((showNav && isTabletWidth) || !isTabletWidth) &&
        <Navigation currentPage={page} navSet={navSet()} setPage={pager} onClickHandler={()=>setShowNav(false)}/>
      }
    </div>
  )
}