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

import  { IOptionsModalProps } from 'components/modals/OptionsModal'
import { useRef } from 'react'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { IConfirmModalProps } from 'components/modals/ConfirmModal'
import Link from 'next/link'
import OptionsList from 'components/ui/OptionsList'
import { colors } from 'styles/variables'
import OptionsDropDown from 'components/ui/OptionsDropDown'

interface Props {
  vacancy: IVacancy
  isActive?: boolean
  isLast?: boolean
  cardMode?: boolean
}

export default function VacancyItem({vacancy, isActive, isLast, ...props}: Props) {
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
    vacancyContext.editVacancy({...vacancy, published: !vacancy.published, salary: Number(vacancy.salary)}, vacancy.id, vacancy.published?'active':'archive')
  }

  const editHandler =() => {
    vacancyContext.editVcInEditor(vacancy)
  }

  const removeHandler =()=> {
    appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, 
      {text: 'Вы действительно хотите удалить вакансию?',
      callback: ()=>{
        vacancyContext.removeVacancy(vacancy.id, vacancy.published)
      }
    })
  }

  const options = <OptionsList options={[
    {title: vacancy?.published?'Архивировать':'Опубликовать', onClick: archiveHandler},
    {title: 'Дублировать'},
    {title: 'Поделиться'},
    {title: 'Продлить и Поднять'},
    {title: 'Улучшить'},
    {title: 'Редактировать', onClick: editHandler},
    {title: 'Удалить', onClick: (e)=> {e.stopPropagation();removeHandler()}, style: {color: colors.red}},
  ]}
  onMouseLeave={()=>openDropDown(false)}
  />

  const openModalHandler =()=> {
    if (isTabletWidth) {
      appContext.showBottomSheet<IOptionsModalProps>(ModalType.OptionsModal, {children: options})
    }
    else {
      openDropDown(!dropDown)
    }
  }

  return (<div className={styles.item}> 
      <div className={styles.top}>
        <p className={styles.name}>{vacancy.name}</p>
        {vacancy.city && vacancy.city.locName && !vacancy.isRemote &&
          <p className={styles.city}>г. {vacancy.city?.locName}</p>
        }
        {vacancy.isRemote &&
          <p className={styles.city}>Удаленно</p>
        }
        <SalaryItem vacancy={vacancy}/>
        <ThreeDotsButton  onMouseEnter={openModalHandler} className={styles.dots}/>
        {!isTabletWidth && 
          <OptionsDropDown 
          options={options}
          getRef={(r) => {dropRef.current = r}} 
          active={dropDown} 
          onClose={()=>openDropDown(false)}/>        
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
      
      {!props.cardMode &&
      <div className={styles.buttonsWrapper}>
        {!isActive && 
          <Button className={styles.button} onClick={setActiveHandler}>Сделать активной</Button>
        ||
          <Link href={`recruiting?vcId=${vacancy.id}`}  className={styles.button}><span>Пригласить подходящих</span></Link>
        }       
        <Button onClick={()=>{router.push(`/responses/${vacancy.id}/`)}} className={styles.button}>Посмотреть {vacancy.totalApplications} {Formatter.pluralize(+vacancy.totalApplications, 'отклик', 'отклика', 'откликов')}</Button>
      </div>
      }

  </div>)
}

