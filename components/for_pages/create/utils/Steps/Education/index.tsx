import RadioListField from 'components/fields/RadioListField'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import AddButton from 'components/ui/AddButton'
import Button from 'components/ui/Button'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { EducationInfo } from 'data/interfaces/Common'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { EducationTypes } from 'types/enums'
import DetailsField from '../../DetailsField'
import styles from './index.module.scss'

interface Props {
  name: string
}

export default function Education(props: Props) {
  const initialData:EducationInfo = {
    toDate: '', 
    fromDate: '', 
    institution: '', 
    speciality: ''
  }

  const creationContext = useCreateVcCvContext()



  const [showDetails, setDetails] = useState<boolean>(false)
  const [detailsInfo, setDetailsInfo] = useState<EducationInfo[]>(creationContext.currentCv?.educationInfo||[])
  const [activeDetails, setActiveDetails] = useState<EducationInfo>(initialData)
  const { setFieldValue, setFieldError } = useFormikContext()
  // const [errorsHandlers, setErrorsHandlers] = useState<EducationInfo>(initialData)

  const saveModalHandler = (fl: EducationInfo) => {
    if(!fl.institution || !fl.fromDate || !fl.speciality) {
      // setErrorsHandlers(state=> {
      //   state.institution = fl.institution?null:'error'
      //   state.speciality = fl.speciality?null:'error'
      //   state.fromDate = fl.fromDate?null:'error'
      //   return state
      // })
    } else {
      setDetailsInfo(f=> [...f, {...fl}])
      setDetails(false)
      // setErrorsHandlers(initialData)
      setActiveDetails(initialData)
    }
  }

  const closeModalHandler = () => {
    setDetails(false)
    setActiveDetails(initialData)
    // setErrorsHandlers(initialData)
  }

  const removeItem = (e: EducationInfo) => {
    setDetailsInfo(state => state.filter(el=> el !== e))
  }

  useEffect(()=>{
    setFieldValue(props.name, detailsInfo)
  }, [detailsInfo])

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

  {showDetails && 
    <DetailsField 
    title={'Место учёбы'}
    onSave={saveModalHandler} 
    onClose={closeModalHandler}
    set={activeDetails}
    inputsSettings={[
      {value: 'institution', name: 'setInstitution', label: 'Заведение: '},
      {value: 'speciality', name: 'setSpeciality', label: 'Специализация: '}
    ]}
    datePickerSettings={{
      on: true,
      formatter: {year: 'numeric'},
      dates: [
        {
          format: 'yyyy', 
          pickerType: 'showYearPicker',
          yearDropdown: true,
          inputLabel: 'Начало обучения',
          dateName: 'set_fromDate',
          dateValue: 'fromDate',
        },
        {
          format: 'yyyy',
          pickerType: 'showYearPicker',
          yearDropdown: true,
          inputLabel:'Окончание обучения',
          dateName: 'set_toDate',
          dateValue: 'toDate',
        }
      ]
    }}
      
    />
  }
  </>)
}