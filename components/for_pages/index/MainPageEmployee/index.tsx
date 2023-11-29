import styles from './index.module.scss'

import { useCharacterContext } from 'context/character_state'
import { useEffect, useState } from 'react'
import ThreeModelVariant from 'components/for_pages/three'
import Image from 'next/image'
import Formatter from 'utils/formatter'
import Button from 'components/ui/Button'
import { useCvContext } from 'context/cv_state'
import CVItem from 'components/for_pages/profile/userProfile/CVs/CvItem'
import Link from 'next/link'
import Spinner from 'components/ui/Spinner'
import { useUserContext } from 'context/user_state'

interface Props {
}

export default function MainPageEmployee(props: Props) {
  const characterContext = useCharacterContext()
  const cvContext = useCvContext()
  const [load, setLoad] = useState<boolean>(true)
  const userContext = useUserContext()


  useEffect(()=>{
    cvContext.setSavedCvs()
    .then(_=>{
      setLoad(false)
    })
  }, [])


  return (<div className={styles.root}> 
    <div className={styles.content}>
      <div className={styles.balance}>
        <p className={styles.title}>Баланс счета</p>
        <div className={styles.card}>
          <p className={styles.count}>{Formatter.formatNumber(userContext.user.balance)}</p>
          <Image className={styles.dollar} src={'/images/dollar.png'} alt={'dollar'} width={66} height={66}/>
          <Button className={styles.whiteButton}>Пополнить баланс</Button>
        </div>
      </div>

      <div className={styles.statsWeek}>
        <p className={styles.title}>Статистика за неделю</p>
        <div className={styles.cards}>
          <div className={styles.card}>
            <p className={styles.desc}>Отклики и приглашения</p>
            <Image className={styles.icon} src={'/images/down.svg'} alt='' width={24} height={24}/>
            <p className={styles.count}>1245</p>
          </div>
          <div className={styles.card}>
            <p className={styles.desc}>Просмотры резюме</p>
            <Image className={styles.icon} src={'/images/eye.svg'} alt='' width={24} height={24}/>
            <p className={styles.count}>1245</p>
          </div>
          <div className={styles.card}>
            <p className={styles.desc}>Активные вакансии</p>
            <Image className={styles.icon} src={'/images/heart.svg'} alt='' width={24} height={24}/>
            <p className={styles.count}>{cvContext.savedCvs.length}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.desc}>Сообщения</p>
            <Image className={styles.icon} src={'/images/circle.svg'} alt='' width={24} height={24}/>
            <p className={styles.count}>1245</p>
          </div>
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
    <div className={styles.model}>
      <ThreeModelVariant {...characterContext.variant } actions={'Idle'}  r={4}/>
    </div>
  </div>)
}