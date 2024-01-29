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

interface Props {
}

export default function CvName(props: Props) {
  const cvCreateContext = useCreateVcCvContext()
  const [taglist, setTaglist] = useState([])
  const formikContext = useFormikContext<{searchPosition: string}>()
  const inputRef = useRef(null!)
  const [isActive, setIsActive ]= useDetectOutsideClick(inputRef, false)
  const isDisable = useRef<boolean>(true)
  
  useEffect(()=>{
    cvCreateContext.setSubCategories('', 1)
    .then(res => {
      setTaglist(res)
    })
  }, [])

  const search = useThrottleFn((s: string)=>{
    cvCreateContext.setSubCategories(s, 1)
  }, 300)

  const onSuggestClick = (category: ISpecializationCategory) => {
    cvCreateContext.setActiveSubcategory([category])
    setIsActive(false)
    formikContext.setFieldValue('searchPosition', '')
    isDisable.current = true
  }

  useEffect(()=>{
    if(!isDisable.current) {
      setIsActive(true)      
    }
    if(formikContext.values.searchPosition?.length > 2) {
      search.callback(formikContext.values.searchPosition)
      isDisable.current = false
    }
  }, [formikContext.values.searchPosition])



  return (
    <div className={styles.root}> 
      <div className={styles.inputWrapper} ref={inputRef}>
        <InputField 
        prefix={<LoupeSvg/>}
        name={'searchPosition'} 
        styleType={'default'} 
        color={'default'} 
        placeholder='Поиск профессии'/>
        {cvCreateContext.subCategories.size > 0 &&
        <div className={classNames(styles.suggestions, !isActive&&styles.disabled)}>
          <div className={styles.suggestionsWrapper}>
            {[...cvCreateContext.subCategories.values()].map(subCategory => {
              return <p className={styles.category} key={subCategory.id} onClick={() => onSuggestClick(subCategory)}>{subCategory.name}</p>
            })}
          </div>
        </div>
        }
      </div>
      <p className={styles.categoryName}>{cvCreateContext.activeSubCategory[0]?.name}</p>
      { taglist.length>0 && 
        <TagList 
        title={'Тэги'} 
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
