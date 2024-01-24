import InputField from 'components/fields/InputField'
import styles from './index.module.scss'
import Validator from 'utils/Validator'
import { useEffect, useRef, useState } from 'react'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import { useFormikContext } from 'formik'
import { IVacancyCreate } from 'data/interfaces/IVacancy'
import Tag from 'components/ui/Tag'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import classNames from 'classnames'


interface Props {
}

export default function VacancyName(props: Props) {

  const [tags, setTagsState]= useState<{name: string}[]>([])
  const [suggestions, setSuggestions] = useState<{name: string}[]>([])
  const inputWrapperRef = useRef(null!)
  const [isActive, setIsActive] = useDetectOutsideClick(inputWrapperRef, false)

  const {values, setFieldValue} = useFormikContext<IVacancyCreate>()

  const onInputChange = (s: string) => {
    setIsActive(true)
    VacancyRepository.suggestPosition({search: s})
    .then(res=> {
      setSuggestions(res)
    })
  }

  const setTags = (s: string) => {
    VacancyRepository.suggestPosition({search: s})
    .then(r=> {
      setTagsState(r)
    })
  }

  const onSuggestionClick = (name: string) => {
    setFieldValue('name', name)
    setTimeout(()=> {
      setIsActive(false)      
    }, 200)
  }
  
  const onChangeThrottle = useThrottleFn(onInputChange, 300)

  useEffect(()=>{
    if(values.name) {
      onChangeThrottle.callback(values.name)
    }
    else {
      setIsActive(false)
    }
  }, [values])

  useEffect(()=>{
    setTags('про')
  }, [])

  return (
    <div className={styles.root}>
      <div className={styles.inputWrapper} ref={inputWrapperRef}>
        <InputField 
        className={styles.input}  
        styleType={'default'} 
        color={'default'} 
        name={'name'} 
        placeholder={'Введите название вакансии'} 
        validate={Validator.required}
        />
        <div className={classNames(styles.suggestions, isActive && styles.active)}>
          <div className={styles.suggestionsWrapper}>
          {
            suggestions.map(s=> {
              return <p onClick={() => onSuggestionClick(s.name)}>{s.name}</p>
            })
          }
          </div>
        </div>
      </div>
      
      {tags.length > 0 && 
      <div className={styles.tags}>
        {
          tags.map(s=> {
            return <Tag text={s.name} onClick={()=>setFieldValue('name', s.name)}/>
          })
        }
      </div>
      }
    </div>
  )
}