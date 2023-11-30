import styles from './index.module.scss'

import { useCharacterContext } from 'context/character_state'
import { useEffect, useState } from 'react'
import ThreeModelVariant from 'components/for_pages/three'
import Image from 'next/image'
import Formatter from 'utils/formatter'
import { useCvContext } from 'context/cv_state'
import CVItem from 'components/for_pages/profile/userProfile/CVs/CvItem'
import Link from 'next/link'
import Spinner from 'components/ui/Spinner'
import { useUserContext } from 'context/user_state'
import classNames from 'classnames'
import { useVacancyContext } from 'context/vacancy_state'
import { IStats } from 'data/interfaces/IUser'
import ChatRepository from 'data/repositories/ChatRepository'
import UserRepository from 'data/repositories/UserRepository'


export default function MainPageEmployee() {
  const characterContext = useCharacterContext()
  const cvContext = useCvContext()
  const vacancyContext = useVacancyContext()
  const [load, setLoad] = useState<boolean>(true)
  const userContext = useUserContext()
  const [messagesCount, setMessagesCount] = useState<string>(null)
  const [stats, setStats] = useState<IStats>(null)

  useEffect(()=>{
    characterContext.init()
    cvContext.setSavedCvs()
    ChatRepository.getChatList({})
    .then(res=>{
      const counter = res.data.map(el=>el.totalUnread).reduce((p, c) =>  p + c, 0)
      setMessagesCount(counter.toString())
    })
    UserRepository.getStats()
    .then(res=> {
      setStats(res)
    })
    vacancyContext.setSavedVacancies()
    .then(_=>{
      setLoad(false)
    })
  }, [])

  return (<div className={styles.root}> 
    <div className={styles.content}>
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
          <Link href={'/profile?page=feedbacks'} className={styles.card}>
            <p className={styles.desc}>Отклики и приглашения</p>
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
          </Link>
          <div className={styles.card}>
            <p className={styles.desc}>Просмотры резюме</p>
            <Image className={styles.icon} src={'/images/eye.svg'} alt='' width={24} height={24}/>
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
          <Link href={'/profile?page=saved'} className={styles.card}>
            <p className={styles.desc}>Избранные вакансии</p>
            <Image className={styles.icon} src={'/images/heart.svg'} alt='' width={24} height={24}/>
            {!vacancyContext?.savedVCs && <Spinner className={styles.count} size={22}/>
            ||
            <p className={styles.count}>{vacancyContext?.savedVCs?.length}</p>
            }
          </Link>
          <Link href={'/messenger'} className={styles.card}>
            <p className={styles.desc}>Сообщения</p>
            <Image className={styles.icon} src={'/images/circle.svg'} alt='' width={24} height={24}/>
            {!messagesCount && <Spinner className={styles.count} size={22}/>
            ||
            <p className={styles.count}>{messagesCount}</p>
            }
          </Link>
        </div>
      </div>

      <div className={styles.statsAll}>
        <p className={styles.title}>Открытые резюме</p>
        <div className={styles.cvs}>
          {cvContext.savedCvs.length > 0 && !load && cvContext.savedCvs.slice(0, 2).map(cv=> {
            return (
              <Link href={'/profile?page=cvs'} className={styles.cv}>
                <CVItem cardMode  cv={cv}/>
              </Link>
            )
          })
          ||
          load && <Spinner size={24} />
          }
        </div>
      </div>
    </div>
    <div className={styles.modelWrapper} >
      {!characterContext.modelLoaded && 
        <Spinner className={styles.modelSpinner} size={52}/>
      } 
      <div className={classNames(styles.model, characterContext.modelLoaded&&styles.model_active) }>
      <ThreeModelVariant {...characterContext.variant } actions={'Idle'}  r={4}/>
      </div>
    </div>
  </div>)
}