import classnames from 'classnames'
import Radio from 'components/fields/RadioListField/Radio'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import CustomScrollbar from 'components/ui/CustomScrollbar'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { ICategory } from 'data/interfaces/Common'
import {  useEffect, useState } from 'react'
import Body from '../Body'
import styles from '../index.module.scss'

interface Props {
  onClose: ()=> void
}

export default function SpecializationModal(props: Props) {

  const cvContext = useCreateVcCvContext()

  const [activeCategory, setActiveCategory] = useState<ICategory>()
  const [activeSubCategory, setActiveSubcategory] = useState<ICategory>(null)

  const setSpecHandler = () => {    
    const helperCv = cvContext.helpObjects
    // const categories = helperCv.categoryIds||[]
    cvContext.setHelpObjects({...helperCv, categoryIds: [activeSubCategory]})
    props.onClose()
  }

  const categoryClickHandler = (el: ICategory) => {
    if(activeCategory === el) {
      setActiveCategory(null)
      return
    }
    cvContext.setSubCategories(el)
    setActiveCategory(el)
  }

  useEffect(()=>{
    cvContext.setCategories()
  }, [])

  const body = (
    <Body 
    onClose={props.onClose} 
    onSave={setSpecHandler} 
    title={'Специализации'}
    withInput={false}
    >
      <div className={styles.categoriesWrapper}>
        <CustomScrollbar>
        {cvContext.categories && Array.from(cvContext.categories.entries()).map(([category, subCategories])=> {
          const isActive = activeCategory === category
          return (
            <div className={styles.category} key={category.id}>
              <p 
              className={classnames(styles.categoryTitle, isActive&&styles.categoryTitle_active)} 
              onClick={()=>categoryClickHandler(category)} 
              >
                {category.name} 
                <ArrowDownSvg className={classnames(styles.arrow, isActive&&styles.arrow_active)}/>
              </p>
              <div className={classnames(styles.subCategoryWrapper, isActive&&styles.subCategoryWrapper_active)}>             
                {subCategories && subCategories.map(el=> {
                  return (
                    <Radio 
                    key={el.id}
                    label={el.name}
                    className={styles.subCategoryItem} 
                    value={el.id} 
                    isActive={activeSubCategory === el} 
                    onChange={()=> setActiveSubcategory(el)}
                    />
                    )
                  })}                
              </div>
            </div>
          )
        })}
        </CustomScrollbar>
      </div>    
    </Body>
  )

  return ( 
    <ModalLayout className={styles.rootLayout} >
      <ModalBody className={styles.modalBody}>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}