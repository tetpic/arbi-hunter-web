import styles from './index.module.scss'

import classnames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ProfileType } from 'data/interfaces/IRegistration' 
import { useRouter } from 'next/router'
import { useUserContext } from 'context/user_state'
import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import Modes from 'components/ui/Modes'
import MenuButtonSvg from 'components/svg/MenuButtonSvg'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { getUserImageSource } from 'utils/helpers'
import SearchBar from '@/components/ui/SearchBar'
import NotificationSvg from '@/components/svg/NotificationSvg'
import HeartSvg from '@/components/svg/HeartSvg'
import StarSvg from '@/components/svg/StarSvg'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  distanceFromTop: number
}

export default function Header(props: Props) {
  const {t} = useTranslation()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const router = useRouter()
  const {isTabletWidth} = appContext.size
  const {profileType, setProfileType} = userContext
  const [fromTop, setFromTop] = useState<number>(0)
  const [direction, setDirection] = useState<'up'|'down'>('up')
  const dropdownRef = useRef<HTMLDivElement>(null!)
  const activePath = router.asPath
  const regPath = '/registration'
  const loginPath = '/login'

  const onSearchbarSubmit = (data: {search?: string}) => {
    const filters = JSON.parse(router?.query?.filters as string||'{}')
    router.push({pathname: '/recruiting', query: {filters: JSON.stringify({...filters, search: data?.search})}})
  }

  useEffect(()=>{
    if(!isTabletWidth) {

      if(props.distanceFromTop > fromTop && props.distanceFromTop <= -40) {
        setDirection('up')
        setFromTop(props.distanceFromTop)
      }
      else if(props.distanceFromTop < fromTop && props.distanceFromTop <= -40) {
        setDirection('down')
        setFromTop(props.distanceFromTop)
      }
      else {
        setDirection('up')
      }
    }
  }, [props.distanceFromTop])



  return ( 
    <div className={classnames(styles.root, styles[direction], appContext.isNavBarActive&&styles.hoveredNavBar)} ref={dropdownRef}>
      {/* {(!userContext.isLogged || !userContext.currentProfile) && */}
      <Link href={'/'} className={styles.logo}>
        <Image src={'/favicon.svg'} alt={'logo'} width={40} height={40}/>
      </Link>
      {/* } */}
      <div className={classnames(styles.contentWrapper, 'contentWrapper')}>
        {(!userContext.isLogged || !userContext.currentProfile) &&
          <Modes 
          buttons={[
            {name: t('employee'), type: ProfileType.Employee},
            {name: t('hirer'), type: ProfileType.Hirer}
          ]} 
          activeButton={profileType} 
          onSet={(type)=>setProfileType(type)}/>  
        }

        {!isTabletWidth && userContext.isLogged && userContext.currentProfile?.profileType &&
          <div className={styles.linksWrapper}>
            <SearchBar 
            onSubmit={(data)=> onSearchbarSubmit(data)}
            onFilterClick={()=>{}}
            />
          </div>
        }
        
        {!isTabletWidth && 
          <div className={classnames(styles.userWrapper, !userContext.currentProfile&&styles.userWrapper_unlogged)}>
            {!userContext.currentProfile && <>
              <Button 
              styleType={['black', 'borderBlue', 'backTransparent']}
              altStyleType={['white', 'borderGrey']}
              href={regPath}
              disabled={activePath === regPath}
              >
                {t('registration')}
              </Button>

              <Button 
              disabled={activePath === loginPath}
              href={loginPath}
              styleType={['grey', 'borderWhite', 'backTransparent']}
              altStyleType={['gradient']}
              >
                {t('login')}
              </Button>
            </>}

            {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Employee && 
            <>
              <Button 
              href={'/create/cv'} 
              styleType={['gradient']}
              >
                {t('create_cv')}
              </Button>
              <Button               
              styleType={['icon', 'black']} 
              altStyleType={['icon','white']}
              className={styles.iconButton}
              >
                <NotificationSvg/>
              </Button>
              <Button  
              styleType={['icon', 'black', 'svg24']} 
              altStyleType={['icon','white', 'svg24', 'invertSvg']}
              className={styles.iconButton}
              href={'/favorites'}
              >
                <HeartSvg/>
              </Button>
              <UserPic 
              key={userContext.currentProfile?.logo?.source||userContext.currentProfile?.image?.source}
              image={getUserImageSource(userContext.currentProfile)} 
              className={styles.userPic} 
              onClick={()=>router.push('/personal/my')}
              />
            </>}

            {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Hirer && 
            <>
              <Button 
              href={'/create/vacancy'} 
              styleType={['gradient']}
              >
                 {t('create_vacancy')}
              </Button>
              <Button 
              href={'/notifications'}
              styleType={['icon', 'black']} 
              className={styles.iconButton} 
              >
                <NotificationSvg/>
              </Button>
              <Button 
              styleType={['icon', 'black', 'svg24']} 
              className={classnames(styles.iconButton, activePath === '/profile?page=saved'&& styles.iconButton_active)} 
              href={'/favorites'}
              >
                <StarSvg/>
              </Button>
              <UserPic 
              key={1} 
              image={userContext.currentProfile?.logo&&FILES+userContext.currentProfile?.logo.source} 
              className={styles.userPic} 
              onClick={()=>router.push('/personal/my')}
              />
            </>}
          </div>
          ||
          <Button styleType={['icon', 'black']} onClick={()=>{appContext.showModal(ModalType.MobileSideBarModal)}}><MenuButtonSvg/></Button>
        }
      </div>
    </div>
  )
}