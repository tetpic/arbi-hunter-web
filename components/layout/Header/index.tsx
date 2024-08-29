import styles from './index.module.scss'

import classnames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/user_state'
import UserPic from 'components/ui/UserPic'
import Modes from 'components/ui/Modes'
import MenuButtonSvg from 'components/svg/MenuButtonSvg'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { AppTheme, ModalType, Preset, SnackbarType } from 'types/enums'
import { getUserImageSource } from 'utils/helpers'
import SearchBar from '@/components/ui/SearchBar'
import NotificationSvg from '@/components/svg/NotificationSvg'
import HeartSvg from '@/components/svg/HeartSvg'
import StarSvg from '@/components/svg/StarSvg'
import useTranslation from 'next-translate/useTranslation'
import ImageHelper from 'utils/ImageHelper'
import { colors } from 'styles/variables'
import NotificationRepository from 'data/repositories/NotificationRepository'
import OptionsDropDown from '@/components/ui/OptionsDropDown'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import Notifications from '@/components/ui/Notifications'
import { ItemsNotificationType } from 'data/interfaces/INotification'
import NoNotificationSvg from '@/components/svg/NoNotificationSvg'
import { useIndexPageContext } from 'context/index_page_state'

interface Props {
  distanceFromTop: number
  authorized?: boolean
}

export default function Header(props: Props) {
  const {t} = useTranslation()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const indexPageContext = useIndexPageContext()

  const router = useRouter()
  const {isTabletWidth} = appContext.size
  const isLightTheme = appContext.theme===AppTheme.Light
  const {setProfileType} = userContext
  const [fromTop, setFromTop] = useState<number>(0)
  const [direction, setDirection] = useState<'up'|'down'>('up')
  const dropdownRef = useRef<HTMLDivElement>(null!)
  const activePath = router.asPath
  const regPath = '/registration'
  const loginPath = '/login'
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const refreshNotificationInterval = useRef<ReturnType<typeof setInterval>>()

  const hirerStatsTypes = [
    ItemsNotificationType.NewApplication,
    ItemsNotificationType.Admin,
    ItemsNotificationType.ChatMessage,
  ]

  const employeeStatsTypes = [
    ItemsNotificationType.NewProposal,
    ItemsNotificationType.ChatMessage,
    ItemsNotificationType.Admin,
  ]
  const [_stats, setStats] = useState<{type: ItemsNotificationType, count: number}[]>([])
  const statsRef = useRef<{type: ItemsNotificationType, count: number}[]>([])

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

  useEffect(()=>{
    if(isTabletWidth) {
      if(dropDown) {
        document.body.style.overflow = 'hidden'
      }
      else {
        document.body.style.overflow = 'unset'
      }
    }
  }, [dropDown])

  
  useEffect(()=>{
    if(!userContext.currentProfile ) {
      refreshNotificationInterval.current = null
      clearInterval(refreshNotificationInterval.current)
      setStats([])
    }
    if(!refreshNotificationInterval.current && userContext.currentProfile) {
      const allowedStatsTypes = (userContext.currentProfile.profileType === ProfileType.Hirer&&hirerStatsTypes) || (userContext.currentProfile.profileType === ProfileType.Employee&&employeeStatsTypes)
      setStats(allowedStatsTypes.map(t=> ({type: t, count: 0})))
      NotificationRepository.getUnreadStats().then(res => {
          indexPageContext.setUnreadStats(res.items)
          setStats(_ => {
            return allowedStatsTypes.map(t => ({type: t, count: res.items.find(i=> i.type === t)?.count||0}))    
          })
          statsRef.current = allowedStatsTypes.map(t => ({type: t, count: res.items.find(i=> i.type === t)?.count||0})) 
        })
      .catch(err => 
        // eslint-disable-next-line no-console
        console.warn(err)
      )
      refreshNotificationInterval.current = setInterval(()=>{
        NotificationRepository.getUnreadStats().then(res => {
          indexPageContext.setUnreadStats(res.items)
          res.items.forEach((el, index) => {
            const resCount = statsRef.current.find(i=> i.type === el.type)?.count||undefined
            if((el.count > resCount) && resCount) {
              if(index === 0) {
                appContext.showSnackbar(`${t('notifications_youhave')} ${
                  (el.type === ItemsNotificationType.NewProposal || el.type === ItemsNotificationType.NewApplication) && t('notifications_newResponse')
                  || t('notifications_newMessage')
                }`, SnackbarType.success, 4000)
              }
              else {
                setTimeout(() => {
                  appContext.showSnackbar(`${t('notifications_youhave')} ${
                    (el.type === ItemsNotificationType.NewProposal || el.type === ItemsNotificationType.NewApplication) && t('notifications_newResponse')
                    || t('notifications_newMessage')
                  }`, SnackbarType.success, 4000)
  
                }, 4100 * index)
              }
            }
          })
          setStats(_ => {
            return allowedStatsTypes.map(t => ({type: t, count: res.items.find(i=> i.type === t)?.count||0}))    
          })
          statsRef.current = allowedStatsTypes.map(t => ({type: t, count: res.items.find(i=> i.type === t)?.count||0})) 
        })
        .catch(err => 
          // eslint-disable-next-line no-console
          console.warn(err)
        )
      }, 20000)
    }

    // return ()=>{
    //   clearInterval(refreshNotificationInterval.current)
    // }
  }, [userContext.currentProfile])



  return (
    <div className={classnames(styles.root, styles[direction], appContext.isNavBarActive&&styles.hoveredNavBar, (!userContext.currentProfile||!props.authorized)&&styles.noProfile)} ref={dropdownRef}>
      {/* {(!userContext.isLogged || !userContext.currentProfile) && */}
      {(!props.authorized) && 
        <Link href={'/'} className={styles.logo}>
          <Image src={'/favicon.svg'} alt={'logo'} width={40} height={40}/>
        </Link>
      }
      {/* } */}
      <div className={classnames(styles.contentWrapper, props.authorized && styles.contentWrapper_authorized, 'contentWrapper')}>
        {(!userContext.isLogged || !userContext.currentProfile) &&
          <Modes
          buttons={[
            {name: t('employee'), type: ProfileType.Employee},
            {name: t('hirer'), type: ProfileType.Hirer}
          ]}
          activeButton={userContext.profileType}
          onSet={(type)=>setProfileType(type)}/>
        }

        {!isTabletWidth && userContext.isLogged && userContext.currentProfile?.profileType &&
          <div className={styles.linksWrapper}>
            <SearchBar
            onSubmit={(data)=> onSearchbarSubmit(data)}
            onFilterClick={()=>router.push('/recruiting')}
            />
          </div>
        }

        {(!isTabletWidth) &&
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
              styleType={['grey', 'borderWhite', 'whiteText', 'backTransparent']}
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
              <div className={styles.notifications}>
                <Button
                buttonRef={dropdownRef}
                onClick={()=>openDropDown(!dropDown)}
                styleType={['icon', 'black']}
                altStyleType={['icon','white']}
                className={styles.iconButton}
                >
                  {_stats?.map(el => el.count).filter(Boolean).length > 0 &&
                    <NotificationSvg color={isLightTheme?colors.black:''}/>
                    ||
                    <NoNotificationSvg color={isLightTheme?colors.black:''} />
                  } 
                </Button>
                <OptionsDropDown 
                usePopper
                className={styles.dropdown}
                popperPlacement='bottom-end'
                options={<Notifications active={dropDown} stats={_stats} onClose={()=>{openDropDown(false)}}/>} 
                active={dropDown} 
                key={'notifications'}
                getRef={(r)=>{dropRef.current = r}}
                onClose={()=>{openDropDown(false)}}
                />
              </div>
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
              image={getUserImageSource(userContext.currentProfile, Preset.smallIconCrop)}
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
              <div className={styles.notifications}>
                <Button
                buttonRef={dropdownRef}
                onClick={()=>openDropDown(!dropDown)}
                styleType={['icon', 'black']}
                altStyleType={['icon', 'white']}
                className={styles.iconButton}
                >
                  {_stats?.map(el => el.count).filter(Boolean).length > 0 &&
                  <NotificationSvg color={isLightTheme?colors.black:''}/>
                  ||
                  <NoNotificationSvg color={isLightTheme?colors.black:''} />
                  }
                </Button>
                <OptionsDropDown 
                usePopper
                className={styles.dropdown}
                options={<Notifications active={dropDown} stats={_stats} onClose={()=>{openDropDown(false)}}/>} 
                active={dropDown} 
                key={'notifications'}
                popperPlacement='bottom-end'
                getRef={(r)=>{dropRef.current = r}}
                onClose={()=>{openDropDown(false)}}
                />
              </div>
              <Button
              styleType={['icon', 'black', 'svg24']}
              altStyleType={['icon', 'white', 'invertSvg']}
              className={classnames(styles.iconButton, activePath === '/profile?page=saved'&& styles.iconButton_active)}
              href={'/favorites'}
              >
                <StarSvg/>
              </Button>
              <UserPic
              key={1}
              image={userContext.currentProfile?.logo&&ImageHelper.urlFromFile(userContext.currentProfile?.logo, Preset.smallIconCrop)}
              className={styles.userPic}
              onClick={()=>router.push('/personal/my')}
              />
            </>}
          </div>
          ||
          <>
          {props.authorized &&
            <div className={styles.notifications}>
              <Button
              buttonRef={dropdownRef}
              onClick={()=>openDropDown(!dropDown)}
              styleType={['icon', 'black']}
              className={styles.menuButton}
              >
                {_stats?.map(el => el.count).filter(Boolean).length > 0 &&
                  <NotificationSvg />
                  ||
                  <NoNotificationSvg  />
                }
              </Button>
              {dropDown &&
                <Notifications active={dropDown} stats={_stats} onClose={()=>{openDropDown(false)}}/>
              }
            </div>
          }

          <Button 
          styleType={['icon', 'black']}  
          className={styles.menuButton}
          onClick={()=>{appContext.showModal(ModalType.MobileSideBarModal)}}>
            <MenuButtonSvg/>
          </Button>
            </>
        }
      </div>
    </div>
  )
}
