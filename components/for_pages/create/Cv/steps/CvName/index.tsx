import InputField from '@/components/fields/InputField'
import styles from './index.module.scss'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useEffect } from 'react'
import TagList from '@/components/ui/TagList'
import { ISpecializationCategory } from 'data/interfaces/Common'

interface Props {
}

export default function CvName(props: Props) {
  const cvCreateContext = useCreateVcCvContext()
  
  useEffect(()=>{
    cvCreateContext.setCategories()  
  }, [])

  useEffect(()=>{
    [...cvCreateContext.categories.keys()].forEach(el=>cvCreateContext.setSubCategories(el))    
  }, [cvCreateContext.categories])

  return (<div className={styles.root}> 
    
    <InputField styleType={'default'} color={'default'} name={'searchPosition'} placeholder='Поиск профессии'/>

    <TagList title={'Тэги'} tags={
      [...cvCreateContext.subCategories.values()].map(el=>(
        {name: el.name, 
          isActive: el.id === (cvCreateContext.activeSubCategory as ISpecializationCategory)?.id , 
          onClick: ()=>cvCreateContext.setActiveSubcategory(el)
        }))
    } 
    titleClassName={styles.tagsTitle}/>

  </div>)
}