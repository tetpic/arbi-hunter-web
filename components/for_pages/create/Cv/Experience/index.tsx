import InputField from 'components/fields/InputField'
import RadioListField from 'components/fields/RadioListField'
import PlusSvg from 'components/svg/PlusSvg'
import { ExperienceInfo } from 'data/interfaces/ICV'
import { FieldArray, useField } from 'formik'
import { useState } from 'react'
import ExperienceDetails from './ExperienceDetails'
import styles from './index.module.scss'

interface Props {
  name: string
}

export default function Experience(props: Props) {

  const [showDetails, setDetails] = useState<boolean>(false)

  const [detailsInfo, setDetailsInfo] = useState<ExperienceInfo[]>([])

  const closwModalHandler = (fl: ExperienceInfo) => {
    debugger
    setDetailsInfo(f=> [...f, {...fl}])
    setDetails(false)
  }


  return (
    <div className={styles.root}>
      <RadioListField 
      name={''}      
      options={[
        {label: 'Есть опыт', value: true},
        {label: 'Нет опыта', value: false},
      ]} 
      />     
      <p className={styles.link} onClick={()=> setDetails(true)}><PlusSvg className={styles.plusSvg} />Добавить место работы</p>
      <FieldArray 
      name={'experienceInfo'}
      render={arrayHelpers => {
        return (<>
        
      
          {detailsInfo.length > 0&&detailsInfo.map(el=> {<>
            <InputField styleType={'default'} type={'hidden'} color={'default'} name={'fromDate'}/>
            <InputField styleType={'default'} type={'hidden'} color={'default'} name={'toDate'}/>
            <InputField styleType={'default'} type={'hidden'} color={'default'} name={'company'}/>
            <InputField styleType={'default'} type={'hidden'} color={'default'} name={'position'}/>
            <p>{el.fromDate + '/' + el.toDate}</p>
            <p className={styles.companyName}>{el.company}</p>
            <p className={styles.description}>{el.description}</p>
          </>})}
          </>
      )
      }}
      />
   
      {showDetails && 
        <ExperienceDetails onSave={closwModalHandler} onClose={()=> setDetails(false)}/>
      }
    </div>
  )
}