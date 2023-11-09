import styles from './index.module.scss'

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

import CvVcOptionsModal, { ICvVcOptionsModalProps } from 'components/modals/OptionsModal'
import { useRef } from 'react'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import classNames from 'classnames'
import { colors } from 'styles/variables'

interface Props {
  vacancy: IVacancy
  isActive?: boolean
  isLast?: boolean
}

export default function VacancyItem({vacancy, isActive, isLast}: Props) {
  const router = useRouter()
  const vacancyContext = useVacancyContext() 
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)


  const setActiveHandler = () => {
    vacancyContext.editVacancy({...vacancy, published: true}, vacancy.id)
    .then(res=> res&&vacancyContext.setArchiveVacancies())
  }

  const archiveHandler =()=> {
    vacancyContext.editVacancy({...vacancy, published: !vacancy.published}, vacancy.id, vacancy.published?'active':'archive')
  }

  const editHandler =() => {
    vacancyContext.editVcInEditor(vacancy)
  }

  const removeHandler =()=> {
    appContext.showModal(ModalType.ConfirmModal, 
      {text: 'Вы действительно хотите удалить вакансию?',
      callback: ()=>{
        vacancyContext.removeVacancy(vacancy.id, vacancy.published)
      }
    })
  }

  const options = (<>
    <p className={styles.option} onClick={archiveHandler}>{vacancy?.published?'Архивировать':'Опубликовать'}</p>
    <p className={styles.option}>Дублировать</p>
    <p className={styles.option}>Поделиться</p>
    <p className={styles.option}>Продлить и Поднять</p>
    <p className={styles.option}>Улучшить</p>
    <p className={styles.option} onClick={editHandler}>Редактировать</p>
    <p className={styles.option} onClick={removeHandler}  style={{color: colors.red}}>Удалить</p>
   </>)

  const openModalHandler =()=> {
    if (isTabletWidth) {
      appContext.showBottomSheet<ICvVcOptionsModalProps>(ModalType.CvVcOptionsModal, {vc: vacancy, children: options})
    }
    else {
      openDropDown(!dropDown)
    }
  }




  

  return (<div className={styles.item}> 
      <div className={styles.top}>
        <p className={styles.name}>{vacancy.name}</p>
        {vacancy.city && vacancy.city.locName &&
          <p className={styles.city}>г. {vacancy.city?.locName}</p>
        }
        <SalaryItem vacancy={vacancy}/>
        <ThreeDotsButton onClick={openModalHandler} className={styles.dots}/>
        {!isTabletWidth &&
        <div ref={dropRef} className={classNames(styles.modalWrapper, dropDown&&styles.modalWrapper_active)}>
          <CvVcOptionsModal isLast={isLast}  onClose={()=>openDropDown(false)} outerData={{vc: vacancy}}>
            {options}
          </CvVcOptionsModal>
        </div>
      }
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

