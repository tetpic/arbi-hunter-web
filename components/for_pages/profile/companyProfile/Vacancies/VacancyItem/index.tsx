import Button from 'components/ui/Button'
import { useVacancyContext } from 'context/vacancy_state'
import { IVacancy } from 'data/interfaces/IVacancy'
import Image from 'next/image'
import { TranslateCurrency } from 'utils/enumsTranslations'
import Formatter from 'utils/formatter'

import styles from './index.module.scss'

interface Props {
  vacancy: IVacancy
  isActive?: boolean
}

export default function VacancyItem({vacancy, isActive}: Props) {

  const vacancyContext = useVacancyContext() 

  const setActiveHandler = () => {
    vacancyContext.editVacancy({published: true}, vacancy.id)
    .then(res=> res&&vacancyContext.setArchiveVacancies())
  }
  

  return (<div className={styles.item}> 
    <p className={styles.name}>{vacancy.name}</p>
      <p className={styles.price}>
        <Image src={'/icons/money.png'} alt={'money icon'} width={26} height={24}/> 
        от {Formatter.formatNumber(vacancy.salary)} {TranslateCurrency(vacancy.currency)}
      </p>
      <div className={styles.stats}>
        <p className={styles.stats_title}>Статистика за неделю</p>
        <div className={styles.stats_item}>
          <p className={styles.stats_desc}>Показы</p>
          <p className={styles.stats_count}>{vacancy.statsShowViews||'0'}</p>
        </div>
        <div className={styles.stats_item}>
          <p className={styles.stats_desc}>Просмотры</p>
          <p className={styles.stats_count}>{vacancy.statsShowResponses||'0'}</p>
        </div>
        <div className={styles.stats_item}>
          <p className={styles.stats_desc}>Отклики</p>
          <p className={styles.stats_count}>{vacancy.statsShowResponses||'0'}<span>{vacancy.statsShowNewVacanciesCount}</span></p>
        </div>
      </div>
      {!isActive && 
      <Button className={styles.button} onClick={setActiveHandler}>Сделать активной</Button>
      ||
      <Button  className={styles.button}>Пригласить подходящих</Button>
      }

  </div>)
}

