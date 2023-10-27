import classnames from 'classnames'
import Radio from 'components/fields/RadioListField/Radio'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { ISpecializationCategory } from 'data/interfaces/Common'
import {  useEffect, useRef } from 'react'
import Body from '../Body'
import styles from '../index.module.scss'
import Scrollbars from 'react-custom-scrollbars-2'

interface Props {
  onClose: ()=> void
}

export default function SpecializationModal(props: Props) {

  const cvContext = useCreateVcCvContext()
  const {activeCategory, activeSubCategory, setActiveCategory, setActiveSubcategory} = cvContext

  const scrollBar = useRef<Scrollbars>(null!)

  const setSpecHandler = () => {    
    const helperCv = cvContext.helpObjects
    cvContext.setHelpObjects({...helperCv, categoryIds: [activeSubCategory]})
    props.onClose()
  }

  const categoryClickHandler = (el: ISpecializationCategory, isLast?: boolean) => {
    setTimeout(()=>{
      isLast&&scrollBar.current.scrollToBottom()
    }, 200)
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
        <Scrollbars ref={scrollBar} style={{height: '100%'}}   autoHide universal>
        {cvContext.categories && Array.from(cvContext.categories.entries()).map(([category, subCategories],index)=> {
          const isActive = activeCategory === category
          return (
            <div className={styles.category} key={category.id}>
              <p 
              className={classnames(styles.categoryTitle, isActive&&styles.categoryTitle_active)} 
              onClick={()=>{
                let isLast:boolean = cvContext.categories.size === index+1
                categoryClickHandler(category, isLast)
              }} 
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
        </Scrollbars>
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