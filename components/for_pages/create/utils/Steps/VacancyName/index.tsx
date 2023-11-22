import InputField from 'components/fields/InputField'
import Image from 'next/image'
import styles from './index.module.scss'
import Specialization from '../Specialization'
import Validator from 'utils/Validator'
import { useEffect, useState } from 'react'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import { useFormikContext } from 'formik'
import { IVacancyCreate } from 'data/interfaces/IVacancy'
import Tag from 'components/ui/Tag'


interface Props {
}

export default function VacancyName(props: Props) {

  const [suggestions, setSuggestions]= useState<{name: string}[]>([])

  const {values, setFieldValue} = useFormikContext<IVacancyCreate>()

  const onInputChange = (s: string) => {
    VacancyRepository.suggestPosition({search: s})
    .then(res=> {
      setSuggestions(res)
    })
  }
  const onChangeThrottle = useThrottleFn(onInputChange, 300)

  useEffect(()=>{
    onChangeThrottle.callback(values.name)
  }, [values])

  

  return (
  <>
    <div className={styles.root}>
      <p className={styles.title}>Введите название вакансии <Image alt={'insert vacancy name'} src={'/icons/scribe.png'} width={24} height={24} /> </p>
      <InputField 
      className={styles.input}  
      styleType={'default'} 
      color={'default'} 
      name={'name'} 
      placeholder={'Введите текст'} 
      validate={Validator.required}
      />
      {suggestions.length > 0 && 
      <div className={styles.tags}>
        {
          suggestions.map(s=> {
            return <Tag text={s.name} onClick={()=>setFieldValue('name', s.name)}/>
          })
        }
      </div>
      
      }

    </div>
    <Specialization />
    </>
  
  )
}