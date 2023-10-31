import RadioListField from 'components/fields/RadioListField'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import AddButton from 'components/ui/AddButton'
import Button from 'components/ui/Button'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { EducationInfo } from 'data/interfaces/Common'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { EducationTypes, ModalType } from 'types/enums'
import { DetailsFieldProps } from '../../DetailsField'
import styles from './index.module.scss'
import { useResize } from 'components/hooks/useResize'
import { useAppContext } from 'context/state'
import { ICVCreate } from 'data/interfaces/ICV'

interface Props {
  name: string
}

export default function Education(props: Props) {

  const {isPhoneWidth} = useResize()
  const appContext = useAppContext()
  const initialData:EducationInfo = {
    toDate: '', 
    fromDate: '', 
    institution: '', 
    speciality: ''
  }

  const creationContext = useCreateVcCvContext()
  const {values, setFieldValue, setFieldError, setFieldTouched} = useFormikContext<ICVCreate>()

  const [showDetails, setDetails] = useState<boolean>(false)
  const [detailsInfo, setDetailsInfo] = useState<EducationInfo[]>(values.educationInfo||creationContext.currentCv?.educationInfo||[])
  const [activeDetails, setActiveDetails] = useState<EducationInfo>(initialData)

  const saveModalHandler = (fl: EducationInfo) => {
    setDetailsInfo(f=> [...f, {...fl}])
    setDetails(false)
    setActiveDetails(initialData)
    appContext.hideModal()
  }

  useEffect(()=>{
    const values =  ['setSpeciality', 'setInstitution', 'set_fromDate']
    if(!activeDetails) {
     values.map(el=> {
        setFieldTouched(el, false)
      })
    }
    else {
      values.map(el=> {
        setFieldTouched(el, true)
      })
    }
  }, [activeDetails])

  const closeModalHandler = () => {
    setDetails(false)
    setActiveDetails(initialData)
    appContext.hideModal()
  }

  const removeItem = (e: EducationInfo) => {
    setDetailsInfo(state => state.filter(el=> el !== e))
  }

  useEffect(()=>{
    setFieldValue(props.name, detailsInfo)
  }, [detailsInfo])

  const detailProps: DetailsFieldProps<EducationInfo> = {
    title: 'Место учёбы',
    onSave: saveModalHandler,
    onClose: closeModalHandler,
    onEditValidator: (fields) => {
      const today = new Date()
      const fromDate = new Date(fields.fromDate)
      const toDate = new Date(fields.toDate)
      
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
    set: activeDetails,
    inputsSettings: [
      {value: '', name: 'institution', label: 'Заведение: ', required: true, errorState: 'Введите название заведения'},
      {value: '', name: 'speciality', label: 'Специализация: ', required: true, errorState: 'Введите специальность'}
    ],
    datePickerSettings: {
      on: true,
      formatter: {year: 'numeric'},
      dates: [
        {
          format: 'yyyy', 
          pickerType: 'showYearPicker',
          yearDropdown: true,
          inputLabel: 'Начало обучения',
          dateName: 'fromDate',
          dateValue: '',
          required: true,
          errorState: 'Введите дату начала обучения'
        },
        {
          format: 'yyyy',
          pickerType: 'showYearPicker',
          yearDropdown: true,
          inputLabel:'Окончание обучения',
          dateName: 'toDate',
          dateValue: '',
        }
      ]
    }
  }

  useEffect(()=>{
    if(showDetails) {
      appContext.showModal(ModalType.DetailsModal, detailProps)
    }
  }, [showDetails])

  return (<>
  <RadioListField 
  wrapperClassName={styles.radiosWrapper}
  options={[
    {label: 'Нет образования', value: 'no'},
    {label: 'Среднее', value: EducationTypes.Secondary},
    {label: 'Средне специальное', value: EducationTypes.SecondarySpecial},
    {label: 'Неоконченное высшее', value: EducationTypes.IncompleteHigher},
    {label: 'Высшее', value: EducationTypes.Higher},
    {label: 'Бакалавр', value: EducationTypes.Bachelor},
    {label: 'Магистр', value:EducationTypes.Master},
    {label: 'Кандидат наук', value:EducationTypes.PhD},
    {label: 'Доктор наук', value: EducationTypes.Doctor},
  ]} 
  name={'education'} 
  />

  {detailsInfo&&detailsInfo.length>0&&detailsInfo.map(el=> {
    return (
      <div 
      key={el.date} 
      className={styles.educationWrapper} 
      >
        <p className={styles.time}>{el.fromDate} {el.toDate?'- '+el.toDate:' - по настоящее время'}</p>
        <p className={styles.companyName}>{el.institution}</p>
        <p className={styles.description}>{el.speciality}</p>
        <Button type={'button'} className={styles.trashButton} onClick={()=> removeItem(el)}><TrashBasketSvg/></Button>
      </div>)
    }) 
  }

  <AddButton onClick={()=> setDetails(true)} text={'Добавить место учебы'}/>

  {/* {showDetails && isPhoneWidth &&
    <DetailsField  {...detailProps}/>
  } */}
  </>)
}