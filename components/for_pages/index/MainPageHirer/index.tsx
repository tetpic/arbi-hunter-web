import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Formatter from 'utils/formatter'
import Button from 'components/ui/Button'
import Link from 'next/link'
import Spinner from 'components/ui/Spinner'
import { useVacancyContext } from 'context/vacancy_state'
import VacancyItem from 'components/for_pages/profile/companyProfile/Vacancies/VacancyItem'
import { useUserContext } from 'context/user_state'
import ChatRepository from 'data/repositories/ChatRepository'
import UserRepository from 'data/repositories/UserRepository'
import { IStats } from 'data/interfaces/IUser'
import { FILES } from 'types/constants'
import classnames from 'classnames'
import Buildings from '../../profile/Personal/Buildings'
import { usePersonalContext } from 'context/personal_state'
import { BackgroundCategoryType } from 'data/interfaces/IBackground'



export default function MainPageHirer() {
  const userContext = useUserContext()
  const personalContext = usePersonalContext()
  const vacancyContext = useVacancyContext()
  const [load, setLoad] = useState<boolean>(true)
  const [messagesCount, setMessagesCount] = useState<string>(null)
  const [stats, setStats] = useState<IStats>()


  useEffect(()=>{
    personalContext.setPersonalPage({profileId: userContext.currentProfile.id}) 
    .then(res => {
      personalContext.setBackgrounds(res)
    })
  }, [])

  useEffect(()=>{
    ChatRepository.getChatList({})
    .then(res=>{
      if(!res?.data|| res?.data?.length === 0) {
        setMessagesCount('0')
      }
      else {
        const counter = res.data.map(el=>el.totalUnread).reduce((p, c) =>  p + c, 0)
        setMessagesCount(counter.toString())
      }
    })
    UserRepository.getStats()
    .then(res=> {
      setStats(res)
    })
    vacancyContext.setActiveVacancies()
    .then(_=>{
      setLoad(false)
    })   

    document.body.style.overflowX = 'hidden'
    return ()=>{
      document.body.style.overflowX = 'hidden'
    }
  }, [])

  return (
    <div className={styles.top}>
    {personalContext.backgrounds &&
      <Buildings profile={userContext.currentProfile} background={personalContext.backgrounds.get(BackgroundCategoryType.Places)}/>
    }
      <div className={styles.statsWeek}>
        <div className={styles.cards}>
          <div className={styles.card}>
            <p className={styles.desc}>Отклики</p>
            <Image className={styles.icon} src={'/images/down.svg'} alt='' width={24} height={24}/>
            {!stats && <Spinner className={styles.count} size={22}/>
            ||
            <p className={styles.count}>
              {stats?.responsesCount.responses_count_prev_interval}
              { Number(stats?.responsesCount.responses_count_interval)>0 &&
                <span>
                  {' + '+ stats?.responsesCount.responses_count_interval}
                </span>
              }
            </p>
            }
          </div>
          <div className={styles.card}>
            <p className={styles.desc}>Просмотры вакансий</p>
            <Image className={styles.icon} src={'/images/down.svg'} alt='' width={24} height={24}/>
            {!stats && <Spinner className={styles.count} size={22}/>
            ||
            <p className={styles.count}>
              {stats?.viewsCount.views_count_prev_interval}
              { Number(stats?.viewsCount.views_count_interval)>0 &&
                <span>
                  {' + '+ stats?.viewsCount.views_count_interval}
                </span>
              }
            </p>
            }
          </div>
          <div className={styles.card}>
            <p className={styles.desc}>Подходящие резюме</p>
            <Image className={styles.icon} src={'/images/down.svg'} alt='' width={24} height={24}/>
            {!stats && <Spinner className={styles.count} size={22}/>
            ||
            <p className={styles.count}>
              {stats?.viewsCount.views_count_prev_interval}
              { Number(stats?.viewsCount.views_count_interval)>0 &&
                <span>
                  {' + '+ stats?.viewsCount.views_count_interval}
                </span>
              }
            </p>
            }
          </div>
        </div>
      </div>


    </div>
  )
}


function MainPageHirerOld() {
  const vacancyContext = useVacancyContext()
  const userContext = useUserContext()
  const [load, setLoad] = useState<boolean>(true)
  const [messagesCount, setMessagesCount] = useState<string>(null)
  const [stats, setStats] = useState<IStats>()

  useEffect(()=>{
    ChatRepository.getChatList({})
    .then(res=>{
      if(!res?.data|| res?.data?.length === 0) {
        setMessagesCount('0')
      }
      else {
        const counter = res.data.map(el=>el.totalUnread).reduce((p, c) =>  p + c, 0)
        setMessagesCount(counter.toString())
      }
    })
    UserRepository.getStats()
    .then(res=> {
      setStats(res)
    })
    vacancyContext.setActiveVacancies()
    .then(_=>{
      setLoad(false)
    })   

    document.body.style.overflowX = 'hidden'
    return ()=>{
      document.body.style.overflowX = 'hidden'
    }
  }, [])



  return (<div className={styles.root}> 
    <div className={classnames(styles.content, !userContext?.currentProfile?.image&&styles.content_wide)}>
      <div className={styles.balance}>
        <p className={styles.title}>Баланс счета</p>
        <div className={styles.card}>
          <p className={styles.count}>{Formatter.formatNumber(userContext?.user?.balance)}</p>
          <Image className={styles.dollar} src={'/images/dollar.png'} alt={'dollar'} width={66} height={66}/>
          <Link href={'/profile?page=shop'} className={styles.whiteButton}>Пополнить баланс</Link>
        </div>
      </div>

      <div className={styles.statsWeek}>
        <p className={styles.title}>Статистика за неделю</p>
        <div className={styles.cards}>
          <div className={styles.card}>
            <p className={styles.desc}>Отклики</p>
            <Image className={styles.icon} src={'/images/down.svg'} alt='' width={24} height={24}/>
            {!stats && <Spinner className={styles.count} size={22}/>
            ||
            <p className={styles.count}>
              {stats?.responsesCount.responses_count_prev_interval}
              { Number(stats?.responsesCount.responses_count_interval)>0 &&
                <span>
                  {' + '+ stats?.responsesCount.responses_count_interval}
                </span>
              }
            </p>
            }
          </div>
          <Link href={'/messenger'} className={styles.card}>
            <p className={styles.desc}>Сообщения</p>
            <Image className={styles.icon} src={'/images/circle.svg'} alt='' width={24} height={24}/>
            {!messagesCount && <Spinner className={styles.count} size={22}/>
            ||
            <p className={styles.count}>{messagesCount}</p>            
            }
          </Link>
          <div className={styles.card}>
            <p className={styles.desc}>Вакансии</p>
            <Image className={styles.icon} src={'/images/search.svg'} alt='' width={24} height={24}/>
            <Button className={styles.buyButton}>Купить</Button>          
          </div>
          <div className={styles.card}>
            <p className={styles.desc}>Доступ к базе резюме</p>
            <Image className={styles.icon} src={'/images/switch_user.svg'} alt='' width={24} height={24}/>
            <Button className={styles.buyButton}>Купить</Button>
          </div>
        </div>
      </div>

      <div className={styles.statsAll}>
        <p className={styles.title}>Открытые вакансии</p>
        <div className={styles.cvs}>
          {vacancyContext.activeVacancies.size > 0 && !load && [...vacancyContext.activeVacancies.values()].slice(0, 2).map(vacancy=> {
            return (
              <Link href={'/profile?page=vacancies'} className={styles.cv}>
                <VacancyItem cardMode vacancy={vacancy}/>
              </Link>
            )
          })
          ||
          load && <Spinner size={24} />
          }
        </div>
      </div>
    </div>
    {userContext?.currentProfile?.image && 
      <div className={styles.model}>
        <div className={styles.imageWrapper}>
          {userContext?.currentProfile?.image &&
            <Image className={styles.build} src={FILES + userContext?.currentProfile?.image.source} width={500} height={588} style={{objectFit: 'contain'}} alt={''}/>
          }            
          {userContext.currentProfile?.logo && userContext?.currentProfile?.image &&
            <Image 
            className={styles.logo}
            src={FILES + userContext?.currentProfile?.logo.source} 
            width={104} height={104} 
            style={{top: userContext?.currentProfile?.image.focalPoint.y*100 + '%', left: userContext?.currentProfile?.image.focalPoint.x*100 + '%'}} 
            alt={''}/>
          }
        </div>
      </div>
    }
  </div>)
}