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
import { useAppContext } from 'context/state'
import { ModelActions } from 'components/for_pages/profile/userProfile/UserEditor'
import { FILES } from 'types/constants'


export default function MainPageEmployee() {
  const characterContext = useCharacterContext()
  const appContext = useAppContext()
  const cvContext = useCvContext()
  const vacancyContext = useVacancyContext()
  const [load, setLoad] = useState<boolean>(true)
  const userContext = useUserContext()
  const [messagesCount, setMessagesCount] = useState<string>(null)
  const [stats, setStats] = useState<IStats>(null)
  const [action, setAction] = useState<ModelActions>(ModelActions.LongAnimation)
  const {isSmDesktopWidth} = appContext.size


  const actionsAllowedMap: {type: ModelActions, duration: number}[] = characterContext.variant.model === 'man'?
  [
    {type: ModelActions.Appearance, duration: ~~(characterContext.durations[ModelActions.Appearance]*1000)},
    {type: ModelActions.Laughter, duration: ~~(characterContext.durations[ModelActions.Laughter]*1000)},
    {type: ModelActions.New, duration: ~~(characterContext.durations[ModelActions.New]*1000)},
    {type: ModelActions.No, duration: ~~(characterContext.durations[ModelActions.No]*1000)},
    {type: ModelActions.ShakesHead, duration: ~~(characterContext.durations[ModelActions.ShakesHead]*1000)},
    {type: ModelActions.Shrug, duration: ~~(characterContext.durations[ModelActions.Shrug]*1000)},
    {type: ModelActions.TurnsAway, duration: ~~(characterContext.durations[ModelActions.TurnsAway]*1000)},
    {type: ModelActions.Yes, duration: ~~(characterContext.durations[ModelActions.Yes]*1000)},
  ]:
  [
    {type: ModelActions.Laughter, duration: ~~(characterContext.durations[ModelActions.Laughter]*1000)},
    {type: ModelActions.Sadness, duration: ~~(characterContext.durations[ModelActions.Sadness]*1000)},
    {type: ModelActions.Shrug, duration: ~~(characterContext.durations[ModelActions.Shrug]*1000)},
    {type: ModelActions.Action_test, duration: ~~(characterContext.durations[ModelActions.Action_test]*1000)},
  ]

  const [temporaryAnimation, setTemporaryAnimation] = useState<{type: ModelActions, duration: number}>(actionsAllowedMap[0])
  const [disableClick, setDisableClick] = useState<boolean>(false)

  useEffect(()=>{
    setTemporaryAnimation(actionsAllowedMap[0])
  }, [characterContext.durations])


  const showNextAnimation = () => {
    setDisableClick(true)
    setAction(temporaryAnimation.type)
    setTimeout(()=> {
      setAction(ModelActions.LongAnimation)
      setTemporaryAnimation((actionsAllowedMap[actionsAllowedMap.map(el=> el.type).indexOf(temporaryAnimation.type)+1]||actionsAllowedMap[0]))
      setDisableClick(false)      
    }, temporaryAnimation.duration)
  }

  useEffect(()=>{
    document.body.style.overflowX = 'hidden'
    return ()=>{
      document.body.style.overflowX = 'auto'
    }
  }, [])  

  useEffect(()=>{
    characterContext.init()
    cvContext.setSavedCvs()
    ChatRepository.getChatList({})
    .then(res=>{
      if(res?.data?.length >0) {
        const counter = res.data.map(el=>el.totalUnread).reduce((p, c) =>  p + c, 0)
        setMessagesCount(counter.toString())
      }
      else {
        setMessagesCount('0')
      }
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
          { 
          isSmDesktopWidth && userContext?.currentProfile?.image && !userContext?.currentProfile?.useOwnLogo &&
          <Image className={styles.userImage} src={FILES + userContext?.currentProfile?.image.source} alt={''} width={300} height={300}/>
            ||
          isSmDesktopWidth && userContext?.currentProfile?.logo && userContext?.currentProfile?.useOwnLogo &&
          <Image className={styles.userLogo} src={FILES + userContext?.currentProfile?.logo.source} alt={''} width={300} height={300}/>
            ||
          <Image className={styles.dollar} src={'/images/dollar.png'} alt={'dollar'} width={66} height={66}/>
          }
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
              <Link href={'/profile?page=cvs'} key={cv.id} className={styles.cv}>
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
      <div onClick={()=> showNextAnimation()} className={classNames(styles.model, characterContext.modelLoaded&&styles.model_active) }>
      {characterContext.variant &&  characterContext.dataLoaded &&
      <ThreeModelVariant disableControls data={characterContext.variant } actions={action}  r={4}/> 
      }
      </div>
    </div>
  </div>)
}