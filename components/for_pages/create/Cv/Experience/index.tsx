import RadioListField from 'components/fields/RadioListField'
import AddButton from 'components/ui/AddButton'
import { useCvContext } from 'context/cv_state'
import { ExperienceInfo } from 'data/interfaces/ICV'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import DetailsField from '../../DetailsField'
import styles from './index.module.scss'

interface Props {
  name: string
}

export default function Experience(props: Props) {

  const initialData: ExperienceInfo = {
    company: '',
    position: '',
    toDate: '',
    fromDate: '',
    description: ''
  }

  const cvContext = useCvContext()

  const [showDetails, setDetails] = useState<boolean>(false)
  const [detailsInfo, setDetailsInfo] = useState<ExperienceInfo[]>(cvContext.currentCv?.experienceInfo||[])
  const [activeDetails, setActiveDetails] = useState<ExperienceInfo>(initialData)
  const { setFieldValue } = useFormikContext()

  const closeModalHandler = (fl: ExperienceInfo) => {
    setDetailsInfo(f=> [...f, {...fl}])
    setDetails(false)
    setActiveDetails(initialData)
  }

  useEffect(()=>{    
    setFieldValue(props.name, [...detailsInfo])
    let currentCv = cvContext.currentCv
    cvContext.setCurrentCv({...currentCv, experienceInfo: [...detailsInfo]})
  }, [detailsInfo])


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
      
      {cvContext.currentCv?.experienceInfo&&cvContext.currentCv?.experienceInfo.length>0&&cvContext.currentCv?.experienceInfo.map(el=> {
        return (<div className={styles.experienceWrapper} onClick={()=>{setActiveDetails(el); setDetails(true)}}>
          <p className={styles.time}>{el.fromDate} {el.toDate?'- '+el.toDate:' - по настоящее время'}</p>
          <p className={styles.companyName}>{el.company}</p>
          <p className={styles.description}>{el.description}</p>
        </div>)
      }) 
      }
      <AddButton onClick={()=> setDetails(true)} text='Добавить место работы'/>
      {showDetails && 
      <DetailsField
        title='Место работы'
        set={activeDetails}
        onSave={closeModalHandler} 
        onClose={()=> setDetails(false)}
        inputsSettings={[
          {label: 'Организация:', name: 'setCompany', value: 'company'},
          {label: 'Должность:', name: 'setProfile', value: 'position'},
          {label: 'Обязанности:', name: 'setDescription', value: 'description', type:'textarea'}
        ]}
        datePickerSettings={{
          on: true,
          formatter: {month: '2-digit', year: 'numeric'},
          dates: [
            {
              format: 'MM.yyyy',
              pickerType: 'showMonthYearPicker',
              monthDropdown: true,
              inputLabel: 'Начало работы:',
              dateName: 'set_fromDate',
              dateValue: 'fromDate'
            },
            {
              format: 'MM.yyyy',
              pickerType: 'showMonthYearPicker',
              monthDropdown: true,
              inputLabel: 'Окончание работы:',
              dateName: 'set_toDate',
              dateValue: 'toDate'
            }
          ]
        }}
      />
      }
    </div>
  )
}