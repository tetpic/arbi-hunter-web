import InputField from '@/components/fields/InputField'
import styles from './index.module.scss'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import TagList from '@/components/ui/TagList'
import { useEffect, useRef, useState } from 'react'
import { useFormikContext } from 'formik'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import classNames from 'classnames'
import { ISpecializationCategory } from 'data/interfaces/Common'
import LoupeSvg from '@/components/svg/LoupeSvg'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'

interface Props {
  onSuggestionClick: (activeSubCategory: ISpecializationCategory[]) => void
}

export default function CvName(props: Props) {
  const {t} = useTranslation()
  const cvCreateContext = useCreateVcCvContext()
  const [taglist, setTaglist] = useState([])
  const formikContext = useFormikContext<{searchPosition: string, categoriesIds: ISpecializationCategory[]}>()
  const inputRef = useRef(null!)
  const [isActive, setIsActive ]= useDetectOutsideClick(inputRef, false)
  const isDisable = useRef<boolean>(true)
  

  const search = useThrottleFn((s: string)=>{
    cvCreateContext.setSubCategories({search: s, page:1})
  }, 300)

  const onSuggestClick = (category: ISpecializationCategory) => {
    cvCreateContext.setActiveSubcategory([category])
    setIsActive(false)
    formikContext.setFieldValue('searchPosition', '')
    isDisable.current = true
  }
  
  useEffect(()=>{
    if(cvCreateContext.activeSubCategory.length > 0) {
      props.onSuggestionClick(cvCreateContext.activeSubCategory)
    }
  }, [cvCreateContext.activeSubCategory])

  useEffect(()=>{
    if(!isDisable.current) {
      setIsActive(true)      
    }
    if(formikContext.values.searchPosition?.length > 1) {
      search.callback(formikContext.values.searchPosition)
      isDisable.current = false
    }
  }, [formikContext.values.searchPosition])

  useEffect(()=>{
    cvCreateContext.setSubCategories({search: '', page: 1})
    .then(res => {
      setTaglist(res)
    })
  }, [])


  return (
    <div className={styles.root}> 
      <div className={styles.inputWrapper} ref={inputRef}>
        <InputField 
        prefix={<LoupeSvg/>}
        name={'searchPosition'} 
        styleType={'default'} 
        color={'default'} 
        placeholder={t('create_cv_searchProfession')}/>
        {cvCreateContext.subCategories.size > 0 &&
        <div className={classNames(styles.suggestions, !isActive&&styles.disabled)}>
          <div className={styles.suggestionsWrapper} data-cy={'suggestions_wrapper'}>
            {[...cvCreateContext.subCategories.values()].map(subCategory => {
              return <p className={styles.category} key={subCategory.id} onClick={() => onSuggestClick(subCategory)}>{subCategory.name}</p>
            })}
          </div>
        </div>
        }
      </div>

      <P useThemeColor styleType={['large', 'w700']}>{cvCreateContext.activeSubCategory[0]?.name}</P>
      { taglist.length>0 && 
        <TagList 
        title={t('create_tags')} 
        tags={taglist.slice(0, 15).map(el => {
          return {
            name: el.name, 
            isActive: el.id === cvCreateContext.activeSubCategory?.[0]?.id , 
            onClick: ()=>{
              cvCreateContext.setActiveSubcategory([el])
              let helpObject = {...cvCreateContext.helpObjects}
              helpObject.categoryIds = [el]
              cvCreateContext.setHelpObjects(helpObject)
            }
          }
        })} 
        titleClassName={styles.tagsTitle}
        />
      }
    </div>
  )
  
}
