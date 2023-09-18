import { useResize } from 'components/hooks/useResize'
import Button from 'components/ui/Button'
import SalaryItem from 'components/ui/SalaryItem'
import Statistics from 'components/ui/Statistics'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import { useAppContext } from 'context/state'
import { useVacancyContext } from 'context/vacancy_state'
import { IVacancy } from 'data/interfaces/IVacancy'
import { useRouter } from 'next/router'
import { ModalType } from 'types/enums'
import Formatter from 'utils/formatter'

import styles from './index.module.scss'

interface Props {
  vacancy: IVacancy
  isActive?: boolean
}

export default function VacancyItem({vacancy, isActive}: Props) {
  const router = useRouter()
  const vacancyContext = useVacancyContext() 
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()

  const setActiveHandler = () => {
    vacancyContext.editVacancy({...vacancy, published: true}, vacancy.id)
    .then(res=> res&&vacancyContext.setArchiveVacancies())
  }

  const openModalHandler =()=> {
    if (isTabletWidth) {
      appContext.showBottomSheet(ModalType.CvVcOptionsModal, {vc: vacancy})
    }
    else {
      appContext.showModal(ModalType.CvVcOptionsModal, {vc: vacancy})
    }
  }
  

  return (<div className={styles.item}> 
      <div className={styles.top}>
        <p className={styles.name}>{vacancy.name}</p>
        <SalaryItem vacancy={vacancy}/>
        <ThreeDotsButton onClick={openModalHandler} className={styles.dots}/>
      </div>

      <Statistics 
      title='Статистика за неделю'
      items={[
        {name: 'Показы', count: vacancy.totalProposals},
        {name: 'Просмотры', count: vacancy.totalViews},
        {name: 'Отклики', count: vacancy.totalApplications},
      ]}
      />
      
      <div className={styles.buttonsWrapper}>
        {!isActive && 
          <Button className={styles.button} onClick={setActiveHandler}>Сделать активной</Button>
        ||
          <Button  className={styles.button}>Пригласить подходящих</Button>
        }
        {vacancy.totalApplications &&+vacancy.totalApplications > 0 &&
          <Button onClick={()=>{router.push(`/responses/${vacancy.id}/`)}} className={styles.button}>Посмотреть {vacancy.totalApplications} {Formatter.pluralize(+vacancy.totalApplications, 'отклик', 'отклика', 'откликов')}</Button>
        }
    </div>

  </div>)
}

