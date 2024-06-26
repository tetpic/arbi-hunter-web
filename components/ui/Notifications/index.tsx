import {  useEffect, useRef, useState } from 'react'
import P from '../P'
import styles from './index.module.scss'
import { ItemsNotificationType } from 'data/interfaces/INotification'
import NotificationRepository from 'data/repositories/NotificationRepository'
import UnreadMessageSvg from '@/components/svg/UnreadMessageSvg'
import ApplicationProposalSvg from '@/components/svg/ApplicationProposalSvg'
import SecuritySvg from '@/components/svg/SecuritySvg'
import { useUserContext } from 'context/user_state'
import Button from '../Button'
import CrossSvg from '@/components/svg/CrossSvg'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from '../Spinner'
import { colors } from 'styles/variables'
import Formatter from 'utils/formatter'
import { useAppContext } from 'context/state'
import Title from '../TitleForSection'
import useTranslation from 'next-translate/useTranslation'
import classNames from 'classnames'
import ArrowLeftSvg from '@/components/svg/ArrowLeftSvg'
import { ProfileType } from 'data/interfaces/IRegistration'
import SystemSvg from '@/components/svg/SystemSvg'
import MessageReadSvg from '@/components/svg/MessageReadSvg'
import { useRouter } from 'next/router'
import Image from 'next/image'

interface Props {
  active?: boolean
  stats: {type: ItemsNotificationType, count: number}[]
  onClose?: () => void
}

export default function Notifications(props: Props) {
  const {t} = useTranslation()
  const userContext = useUserContext()
  const profileType = userContext.currentProfile.profileType
  const appContext = useAppContext()
  const isTabletWidth = appContext.size.isTabletWidth
  const router = useRouter()
  const [page, setPage] = useState<'stats'|'list'>('stats')
  const [currentType, setCurrentType] = useState<ItemsNotificationType>()
  const [currentData, setCurrentData] = useState<{total: number, data: any[]}>()
  const [paginator, setPaginator] = useState<number>(1)
  const scrollableTarget = useRef<HTMLDivElement>(null!)
  

  const getStat = (type: ItemsNotificationType, count: number) => {
    switch (type) {
      case ItemsNotificationType.ChatMessage:
        return {
          name: 'У вас есть новые сообщения', 
          icon: <UnreadMessageSvg/>, 
          colors: ['#AC6CDB', '#586DE4'], 
          countText: `Вам отправили ${count} ${Formatter.pluralize(count, t('message1'), t('message2'), t('message3'))}`
        }
      case ItemsNotificationType.NewApplication:
        return {
          name: profileType===ProfileType.Hirer ? 'Отклики' : 'На резюме откликнулись', 
          icon: <ApplicationProposalSvg/>, colors: ['#F3CE7B', '#E76056'], 
          countText: `У вас  ${count} ${Formatter.pluralize(count, 'новый отклик', 'новых отклика', 'новых откликов')}`
        }
      case ItemsNotificationType.NewProposal:
        return {
          name: 'На резюме откликнулись', 
          icon: <ApplicationProposalSvg/>, 
          colors: ['#F3CE7B', '#E76056'],  countText: `У вас  ${count} новых предложения`
        }
      case ItemsNotificationType.Admin:
        return {
          name: 'Системное уведомление', 
          icon: <SystemSvg/>, 
          colors: ['#2BC56C', '#4E81F3'], 
          countText: 'Включите уведомления в настройках'
        }
        case ItemsNotificationType.UserBlocked:
        return {
          name: 'Пользователь заблокирован', 
          icon: <SecuritySvg/>, 
          colors: ['#7C5BFF', '#39E1C3']
        }
      case ItemsNotificationType.CvRejected:
        return {
          name: 'У вас есть новые сообщения 1', 
          icon: <UnreadMessageSvg/>, 
          colors: ['#AC6CDB', '#586DE4']
        }
      case ItemsNotificationType.UserRegistered:
        return {
          name: 'Безопасность', 
          icon: <SecuritySvg/>, 
          colors: ['#AC6CDB', '#586DE4'], 
          countText: 'Вход с нового устройства'
        }
      case ItemsNotificationType.UserUnBlocked:
        return {
          name: 'У вас есть новые сообщения 3', 
          icon: <UnreadMessageSvg/>, 
          colors: ['#AC6CDB', '#586DE4']
        }
      case ItemsNotificationType.VacancyRejected:
        return {
          name: 'У вас есть новые сообщения 4', 
          icon: <UnreadMessageSvg/>, 
          colors: ['#AC6CDB', '#586DE4']
        }
      default:
        return {
          name: 'У вас есть новые сообщения', 
          icon: <UnreadMessageSvg/>, 
          colors: ['#AC6CDB', '#586DE4']
        }
    }
  }

  const onClickReducer = (type: ItemsNotificationType, data: any) => {
    switch(type) {
      case ItemsNotificationType.NewApplication: 
        return `/cv/${data?.cvId}`
      case ItemsNotificationType.ChatMessage:
        return `/messenger?chat=${data.chatId}`
      case ItemsNotificationType.NewProposal:
        return `/vacancy/${data.vacancyId}`
    }
  }



  const nextPage = () => {
    NotificationRepository.getNotifyList({types: currentType}, paginator+1, isTabletWidth?30:10).then(res => {  
      setPaginator(state => state + 1)
      setCurrentData(state => ({...state, data: [...state.data, ...res.data]}))
    })

  }

  useEffect(()=>{
    if(!props.active) {
      setPaginator(1)
      setCurrentData(null)
      setCurrentType(null)
      setPage('stats')
    }
  }, [props.active])

  useEffect(()=>{
    if(currentType) {
      NotificationRepository.getNotifyList({types: currentType}, paginator, isTabletWidth?30:10).then(res => {
        setCurrentData(res)
      })
    }
  }, [currentType])

  return (<div className={styles.root}> 
  {page === 'stats' && 
  <>
  {isTabletWidth && <Title title={'Уведомления'} onBackClick={()=>props.onClose()}/>
    ||
    <P styleType={['w600', 'large']}>Уведомления</P>
  }
    <div className={styles.banner}>
      <P styleType={['w500', 'medium']} className={styles.banner__title}>Не забудьте о настройках телефона </P>
      <P styleType={['small']} className={styles.banner__sub}>Включите уведомления там, чтобы ничего не пропустить</P>
      <P 
      styleType={['w500', 'medium']}  
      className={styles.banner__button}
      onClick={()=>{
        router.push({pathname: '/settings', query: {page: 'notifications'}})
        props.onClose()
      }}
      >Перейти в настройки</P>
      <Image 
      src={'/images/notificationPage/bell.png'} 
      className={styles.banner__image}
      alt={''} 
      width={122} 
      height={122}
      />
    </div>
    <div className={styles.notificationList}>
      {Boolean(props.stats?.length) && props.stats.map((el, index) => {
        const stat = getStat(el.type, el.count)
        return (
          <>
          <div 
          className={styles.item} 
          onClick={(e)=>{
            e.preventDefault()
            e.stopPropagation()
            setPage('list')
            setCurrentType(el.type)
          }}
          >
            <div 
            className={styles.icon}
            // @ts-ignore
            style={{'--color1': stat.colors[0], '--color2': stat.colors[1]}}
            >
              {stat.icon}
            </div> 
            <P className={styles.name} styleType={['w500', 'medium']}>{stat.name}</P>
            <P className={styles.counterText} styleType={['greyLight', 'w500', 'medium']}>{stat.countText}</P>
            <P styleType={['green', 'small']} className={styles.counterBadge}>{el.count}</P>
          </div>
          {index < props.stats.length - 1 &&
          <div className={styles.divider}></div>
          }  
          </>
        )
      })}
    </div>
  </>
  ||
  page === 'list' && (() => {
    const stat = getStat(currentType, props.stats.find(el => el.type === currentType)?.count||0)
    return (<>
      <div className={classNames(styles.item, styles.listItem)}>
        <div 
        className={styles.icon}
        // @ts-ignore
        style={{'--color1': stat.colors[0], '--color2': stat.colors[1]}}
        >
          {stat.icon}
        </div> 
        <P className={styles.name} styleType={isTabletWidth?['w500', 'medium', 'textCenter']:['w500', 'medium']}>{stat.name}</P>
        <P className={styles.counterText} styleType={['greyLight', 'w500', 'medium']}>{stat.countText}</P>
        <Button 
        styleType={isTabletWidth?['black', 'icon']:['backTransparent', 'icon']} 
        className={styles.closeButton}   
        onClick={(e)=>{
          e.preventDefault()
          e.stopPropagation()
          setPage('stats')
          setCurrentType(null)
          setCurrentData(null)
        }}
        >
          {isTabletWidth && <ArrowLeftSvg/>
          ||
          <CrossSvg/>
          }
        </Button>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.messages} id='notificationsWrapper'  ref={scrollableTarget}>
        <InfiniteScroll
        dataLength={currentData?.data?.length||0}
        next={nextPage}
        scrollableTarget={'notificationsWrapper'}
        inverse
        height={'100%'}
        style={{display: 'flex', flexDirection: 'column-reverse'}}
        loader={<Spinner size={24} color={colors.blue}/>}
        hasMore={true}
        >
        {
          currentData?.data?.map(el => 
            <div className={styles.messageWrapper}>
              <div className={styles.message} onClick={()=>{
                router.push(onClickReducer(el.type, el.data))
                setTimeout(() => {
                  props.onClose()
                }, 100)
              }}>
                <P styleType={['small']}>{el.title}</P>
                <P styleType={['greyLight', 'w500', 'small', 'alignCenter']}>{Formatter.formatDate(el.createdAt)}  <MessageReadSvg className={styles.readIcon} color={!el.isRead&&colors.greyLight}/> </P>
              </div>
            </div>
          )
        }
        </InfiniteScroll>
        
      </div>
    </>)
  })()
  }
    {props.stats?.length === 0 && page === 'stats' &&
      <P styleType={['greyLight', 'small', 'w500']}>Нет новых уведомлений</P>
    }
  </div>)
}