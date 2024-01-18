import RadioListField from 'components/fields/RadioListField'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import AddButton from 'components/ui/AddButton'
import Button from 'components/ui/Button'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { ExperienceInfo } from 'data/interfaces/Common'
import { ICVCreate } from 'data/interfaces/ICV'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { DetailsFieldProps } from '../../DetailsField'
import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'

interface Props {
  name: string
}

export default function Experience(props: Props) {
  const appContext = useAppContext()

  const initialData: ExperienceInfo = {
    company: '',
    position: '',
    toDate: '',
    fromDate: '',
    description: ''
  }

  const cvContext = useCreateVcCvContext()

  const [showDetails, setDetails] = useState<boolean>(false)
  const [detailsInfo, setDetailsInfo] = useState<ExperienceInfo[]>(cvContext.currentCv?.experienceInfo||[])
  const [activeDetails, setActiveDetails] = useState<ExperienceInfo>(initialData)
  const formikContext = useFormikContext()
  const values = formikContext.values as ICVCreate
  const {setFieldTouched} = formikContext


  const closeModalHandler = (fl: ExperienceInfo) => {
    setDetailsInfo(f=> [...f, {...fl}])
    setDetails(false)
    setActiveDetails(initialData)
    appContext.hideModal()
  }

  const removeExp = (e: ExperienceInfo) => {
    setDetailsInfo(state=> state.filter(el => el !==e))
  }

  useEffect(()=>{   
    formikContext.setFieldValue(props.name, [...detailsInfo])
    let currentCv = cvContext.currentCv
    cvContext.setCurrentCv({...currentCv, experienceInfo: [...detailsInfo]})
  }, [detailsInfo])

  useEffect(()=>{
    const values =  ['setCompany', 'set_fromDate', 'setProfile']
    if(!showDetails) {
     values.map(el=> {
        setFieldTouched(el, false)
      })
    }
    else {
      values.map(el=> {
        setFieldTouched(el, true)
      })
    }
  }, [showDetails])

  const detailsFieldProps: DetailsFieldProps<ExperienceInfo> = {
    title:'Место работы',
    set: activeDetails,
    onSave: closeModalHandler,
    onEditValidator: (fields) => {
      const today = new Date()
      const fromDateSplitted = fields.fromDate&&fields.fromDate.split('.')
      const fromDate = new Date(Number(fromDateSplitted[1]), Number(fromDateSplitted[0])-1)
      const toDateSplitted = fields.toDate&&fields.toDate.split('.')
      const toDate = new Date(Number(toDateSplitted[1]), Number(toDateSplitted[0])-1 )
      if(fromDate > toDate ) {
        return {error: 'Дата окончания не может быть раньше даты начала'}
      }
      if(toDate > today) {
        return {error: 'Дата окончания не может быть в будущем'}
      }
      if(fromDate > today) {
        return {error: 'Дата начала не может быть в будущем'}
      }
      else {
        return true
      }
    },
    onClose:()=> {
      setDetails(false)
      appContext.hideModal()
    },
    inputsSettings:[
      {label: 'Организация:', name: 'company', value: '', required: true, errorState:'Введите название компании'},
      {label: 'Должность:', name: 'position', value: '', required: true, errorState: 'Введите название занимаемой должности'},
      {label: 'Обязанности:', name: 'description', value: '', type:'textarea'}
    ],
    datePickerSettings: {
      on: true,
      formatter: {month: '2-digit', year: 'numeric'},
      dates: [
        {
          format: 'MM.yyyy',
          pickerType: 'showMonthYearPicker',
          monthDropdown: true,
          inputLabel: 'Начало работы:',
          dateName: 'fromDate',
          dateValue: '',
          required: true,
          errorState: 'Укажите дату начала работы'
        },
        {
          format: 'MM.yyyy',
          pickerType: 'showMonthYearPicker',
          monthDropdown: true,
          inputLabel: 'Окончание работы:',
          dateName: 'toDate',
          dateValue: ''
        }
      ]
    }
  }

  const onAddButtonClick = () => {
    setDetails(true)
    appContext.showModal(ModalType.DetailsModal, detailsFieldProps)
  }

  return (
    <div className={styles.root}>
      <RadioListField 
      name={'workExperiencePresense'}     
      itemCircleClassname={styles.radioCircle}
      activeItemClassName={styles.radioItemActive}
      wrapperClassName={styles.radioWrapper}
      options={[
        {label: 'Есть опыт', value: 'present'},
        {label: 'Нет опыта', value: 'absent'},
      ]} 
      />   
       
      
      {cvContext.currentCv?.experienceInfo
      && values.workExperiencePresense === 'present' 
      &&cvContext.currentCv?.experienceInfo.length>0
      &&cvContext.currentCv?.experienceInfo
      .map((el, index)=> {
        return (<div 
          key={index}
        className={styles.experienceWrapper} 
        // onClick={()=>{setActiveDetails(el); setDetails(true)}}
        >
          <p className={styles.time}>{el.fromDate} {el.toDate?'- '+el.toDate:' - по настоящее время'}</p>
          <p className={styles.companyName}>{el.company}</p>
          <p className={styles.description}>{el.description}</p>
          <Button type='button' className={styles.trashButton} onClick={()=>removeExp(el)}><TrashBasketSvg/></Button>
        </div>)
      }) 
      }

      {values.workExperiencePresense === 'present' &&
        <AddButton onClick={onAddButtonClick} text='Добавить место работы'/>
      }
    </div>
  )
}