import RadioListField from 'components/fields/RadioListField'
import AddButton from 'components/ui/AddButton'
import { useCvContext } from 'context/cv_state'
import { ExperienceInfo } from 'data/interfaces/ICV'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import ExperienceDetails from './ExperienceDetails'
import styles from './index.module.scss'

interface Props {
  name: string
}

export default function Experience(props: Props) {

  const cvContext = useCvContext()

  const [showDetails, setDetails] = useState<boolean>(false)
  const [detailsInfo, setDetailsInfo] = useState<ExperienceInfo[]>([])
  const [activeDetails, setActiveDetails] = useState<ExperienceInfo>()
  const { setFieldValue } = useFormikContext()

  const closeModalHandler = (fl: ExperienceInfo) => {
    setDetailsInfo(f=> [...f, {...fl}])
    setDetails(false)
    setActiveDetails(undefined)
  }

  useEffect(()=>{
    setFieldValue(props.name, detailsInfo)
  }, [detailsInfo])


  return (
    <div className={styles.root}>
      <RadioListField 
      name={'have_exp'}     
      itemCircleClassname={styles.radioCircle}
      activeItemClassName={styles.radioItemActive}
      wrapperClassName={styles.radioWrapper}
      options={[
        {label: 'Есть опыт', value: true},
        {label: 'Нет опыта', value: false},
      ]} 
      />     
      
   
      {detailsInfo&&detailsInfo.length>0&&detailsInfo.map(el=> {
        return (<div className={styles.experienceWrapper} onClick={()=>setActiveDetails(el)}>
          <p className={styles.time}>{el.fromDate} {el.toDate?'- '+el.toDate:' - по настоящее время'}</p>
          <p className={styles.companyName}>{el.company}</p>
          <p className={styles.description}>{el.description}</p>
        </div>)
      }) 
      }
      <AddButton onClick={()=> setDetails(true)} text='Добавить место работы'/>
      {(showDetails || activeDetails) && 
        <ExperienceDetails activeDetails={activeDetails} onSave={closeModalHandler} onClose={()=> setDetails(false)}/>
      }
    </div>
  )
}