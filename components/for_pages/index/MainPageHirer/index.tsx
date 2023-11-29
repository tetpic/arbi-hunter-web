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


interface Props {
}

export default function MainPageHirer(props: Props) {
  const vacancyContext = useVacancyContext()
  const userContext = useUserContext()
  const [load, setLoad] = useState<boolean>(true)
  const [messagesCount, setMessagesCount] = useState<number>(0)

  useEffect(()=>{
    vacancyContext.setActiveVacancies()
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
          <Button className={styles.whiteButton}>Пополнить баланс</Button>
        </div>
      </div>

      <div className={styles.statsWeek}>
        <p className={styles.title}>Статистика за неделю</p>
        <div className={styles.cards}>
          <div className={styles.card}>
            <p className={styles.desc}>Отклики</p>
            <Image className={styles.icon} src={'/images/down.svg'} alt='' width={24} height={24}/>
            <p className={styles.count}>1245</p>
          </div>
          <div className={styles.card}>
            <p className={styles.desc}>Сообщения</p>
            <Image className={styles.icon} src={'/images/circle.svg'} alt='' width={24} height={24}/>
            <p className={styles.count}>1245</p>
          </div>
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
    <div className={styles.model}>
      <Image src={'/images/buildings/building1.png'} width={550} height={570} style={{objectFit: 'contain'}} alt={''}/>
    </div>
  </div>)
}