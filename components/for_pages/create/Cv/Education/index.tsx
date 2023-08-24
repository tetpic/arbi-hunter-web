import RadioListField from 'components/fields/RadioListField'
import PlusSvg from 'components/svg/PlusSvg'
import AddButton from 'components/ui/AddButton'
import { EducationInfo } from 'data/interfaces/ICV'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { EducationTypes } from 'types/enums'
import EducationDetails from './EducationDetails'
import styles from './index.module.scss'

interface Props {
  name: string
}

export default function Education(props: Props) {
  const [showDetails, setDetails] = useState<boolean>(false)
  const [detailsInfo, setDetailsInfo] = useState<EducationInfo[]>([])
  const [activeDetails, setActiveDetails] = useState<EducationInfo>()
  const { setFieldValue } = useFormikContext()

  const saveModalHandler = (fl: EducationInfo) => {
    setDetailsInfo(f=> [...f, {...fl}])
    setDetails(false)
    setActiveDetails(undefined)
  }

  const closeModalHandler = () => {
    setDetails(false); 
    setActiveDetails(undefined)
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
      <div className={styles.educationWrapper} onClick={()=>setActiveDetails(el)}>
        <p className={styles.time}>{el.fromDate} {el.toDate?'- '+el.toDate:' - по настоящее время'}</p>
        <p className={styles.companyName}>{el.institution}</p>
        <p className={styles.description}>{el.speciality}</p>
      </div>)
    }) 
  }

  <AddButton onClick={()=> setDetails(true)} text={'Добавить место учебы'}/>

  {(showDetails || activeDetails) && 
    <EducationDetails activeDetails={activeDetails} onSave={saveModalHandler} onClose={closeModalHandler}/>
  }
  </>)
}