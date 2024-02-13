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
import { ModalType, TariffType} from 'types/enums'
import Formatter from 'utils/formatter'

import  { IOptionsModalProps } from 'components/modals/OptionsModal'
import { useRef } from 'react'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { IConfirmModalProps } from 'components/modals/ConfirmModal'
// import Link from 'next/link'
import OptionsList from 'components/ui/OptionsList'
import { colors } from 'styles/variables'
import OptionsDropDown from 'components/ui/OptionsDropDown'
import { TranslateTariffType } from 'utils/enumsTranslations'
import classNames from 'classnames'
import Progress from './Progress'

interface Props {
  vacancy: IVacancy
  isActive?: boolean
  isLast?: boolean
  cardMode?: boolean
  type?: 'drafts' | 'archive'
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
    .then(res=> res&&vacancyContext.setInactiveVacancies())
  }

  const archiveHandler =()=> {
    vacancyContext.editVacancy({...vacancy, published: !vacancy.published, salaryMin: Number(vacancy.salaryMin), salaryMax: Number(vacancy.salaryMax)}, vacancy.id, vacancy.published?'active':'archive')
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
      appContext.showBottomSheet<IOptionsModalProps>(ModalType.OptionsModal, {children: options}, 430)
    }
    else {
      openDropDown(!dropDown)
    }
  }

  return (<div className={styles.item}> 
      <div className={styles.top}>
        {vacancy.publishedAt && vacancy.published &&
          <p className={styles.timeRemains}>Истекает {Formatter.formatDate(vacancy.publishedAt, {plusDays: 30})}</p>
        }
        {props.type === 'drafts' && vacancy.updatedAt &&
          <p className={styles.timeSaved}>Сохранен {Formatter.formatDate(vacancy.updatedAt, {timeOptions: {year: 'numeric'}})}</p>
        }
        {props.type === 'archive' && vacancy.updatedAt &&
          <p className={styles.timeSaved}>В архиве {Formatter.formatDate(vacancy.updatedAt, {timeOptions: {year: 'numeric'}})}</p>
        }
        <p className={styles.name}>{vacancy.name}</p>
        {vacancy.city && vacancy.city.locName && !vacancy.isRemote &&
          <p className={styles.city}>г. {vacancy.city?.locName}</p>
        }
        {vacancy.isRemote &&
          <p className={styles.city}>Удаленно</p>
        }
        <SalaryItem vacancy={vacancy}/>

        <p className={classNames(styles.tariff, vacancy.tariff === TariffType.Vip && styles.tariff_vip)}>{TranslateTariffType(vacancy.tariff)}</p>

        <ThreeDotsButton  onMouseEnter={openModalHandler} onClick={openModalHandler} className={styles.dots}/>
        {!isTabletWidth && 
          <OptionsDropDown 
          options={options}
          getRef={(r) => {dropRef.current = r}} 
          active={dropDown} 
          onClose={()=>openDropDown(false)}/>        
        }
      </div>

      {props.type !== 'drafts' &&
        <Statistics 
        title='Статистика за неделю'
        items={[
          {name: 'Показы', count: vacancy.totalProposals},
          {name: 'Просмотры', count: vacancy.totalViews},
          {name: 'Отклики', count: vacancy.totalApplications},
        ]}
        />
        ||
        vacancy.completedSteps &&
        <Progress progress={vacancy.completedSteps}/>
      }
      
      {!props.cardMode &&
        <div className={styles.buttonsWrapper}>
          <Button onClick={()=>{router.push(`/responses/${vacancy.id}/`)}} styleType={['gradient']}>Смотреть отклики</Button>
          {!isActive && 
            <Button styleType={['black']}  onClick={setActiveHandler}>Сделать активной</Button>
          ||
            <Button href={`recruiting?vcId=${vacancy.id}`} styleType={['black']}  className={styles.button}>Подходящие резюме</Button>
          }       
        </div>
      }
  </div>)
}

