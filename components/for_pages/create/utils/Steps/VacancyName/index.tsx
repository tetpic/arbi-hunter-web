import InputField from 'components/fields/InputField'
import styles from './index.module.scss'
import Validator from 'utils/Validator'
import { useEffect, useRef, useState } from 'react'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import { useFormikContext } from 'formik'
import { IVacancyCreate } from 'data/interfaces/IVacancy'
import Tag from 'components/ui/Tag'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import classNames from 'classnames'
import LoupeSvg from '@/components/svg/LoupeSvg'
import CategoryRepository from 'data/repositories/CategoryRepository'
import { ISpecializationCategory } from 'data/interfaces/Common'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { ISpecializationModalProps } from '@/components/modals/CvModals/Specialization'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import P from '@/components/ui/P'


interface Props {
  onSuggestClick?: (value?: string) => void
}

export default function VacancyName(props: Props) {

  // const [tags, setTagsState]= useState<{name: string}[]>([])
  const [suggestions, setSuggestions] = useState<ISpecializationCategory[]>([])
  const inputWrapperRef = useRef(null!)
  const [isActive, setIsActive] = useDetectOutsideClick(inputWrapperRef, false)
  const cvContext = useCreateVcCvContext()
  const appContext = useAppContext()


  const {values, setFieldValue} = useFormikContext<IVacancyCreate>()
  const isClicked = useRef<boolean>(true)

  const onInputChange = (s: string) => {
    if(!isClicked.current) {
      setIsActive(true)
    }
    CategoryRepository.getSubcategories({search: s})
    .then(res=> {
      setSuggestions(res)
      isClicked.current = false
    })
  }

  // const setTags = (s: string) => {
  //   VacancyRepository.suggestPosition({search: s})
  //   .then(r=> {
  //     setTagsState(r)
  //   })
  // }

  const onModalSubmit = (data: ISpecializationCategory[]) => {
    cvContext.setActiveSubcategory(data)
    cvContext.setActiveCategory(null)

    const helperCv = cvContext.helpObjects
    cvContext.setHelpObjects({...helperCv, categoryIds: data})
  }

  const openModalHandler = () => {
    appContext.showModal<ISpecializationModalProps>(ModalType.SpecializationModal, {
      onSubmit: (data) => onModalSubmit(data), 
      manyItems: false
    })
  }

  const onSuggestionClick = (name: string, category?: ISpecializationCategory ) => {
    if(category) {
      cvContext.setActiveSubcategory([category])
    }
    else {
      CategoryRepository.getSubcategories({key: 'sub-other'})
      .then(res=> {
        cvContext.setActiveSubcategory(res)
      })
    }
    setFieldValue('name', name)
    setIsActive(false)
    isClicked.current = true
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
    
    // setTags('про')
  }, [])

  return (
    <div className={styles.root}>
      <div className={styles.inputWrapper} ref={inputWrapperRef}>
        <InputField 
        className={styles.input}  
        styleType={'default'} 
        color={'default'} 
        name={'name'} 
        prefix={<LoupeSvg/>}
        placeholder={'Введите название вакансии'} 
        validate={Validator.required}
        />
        <div className={classNames(styles.suggestions, isActive && (suggestions.length > 0||values.name) && styles.active)}>
          <div className={styles.suggestionsWrapper}>
            {values.name &&
            <p onClick={() => {
              onSuggestionClick(values.name)
            }}>{values.name}</p>
            }
          {
            suggestions.map(s=> {
              return <p onClick={() => {
                onSuggestionClick(s.name, s)
              }}>{s.name}</p>
            })
          }
          </div>
        </div>
      </div>
      {cvContext.activeSubCategory[0] &&
      <>
        <P styleType={['w700', 'large']} className={styles.title}>Специализация</P>
        <Tag text={cvContext.activeSubCategory[0].name} onClick={openModalHandler}/>
      </>
      }
      
      {/* {tags.length > 0 && 
      <div className={styles.tags}>
        {
          tags.map(s=> {
            return <Tag text={s.name} onClick={()=>{
              onSuggestionClick(s.name)
            }} isActive={s.name === values.name}/>
          })
        }
      </div>
      } */}
    </div>
  )
}