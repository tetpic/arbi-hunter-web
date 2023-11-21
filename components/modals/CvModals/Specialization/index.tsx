import styles from '../index.module.scss'

import classnames from 'classnames'
// import Radio from 'components/fields/RadioListField/Radio'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { ISpecializationCategory } from 'data/interfaces/Common'
import {  useEffect, useRef, useState } from 'react'
import Body from '../Body'
import Scrollbars from 'react-custom-scrollbars-2'
import { useAppContext } from 'context/state'
// import { SnackbarType } from 'types/enums'
// import Checkbox from 'components/fields/CheckboxListField/Checkbox'
import { Form, FormikProvider, useFormik } from 'formik'
import CheckboxListField from 'components/fields/CheckboxListField'
import RadioListField from 'components/fields/RadioListField'
import { SnackbarType } from 'types/enums'
import Checkbox from 'components/fields/CheckboxListField/Checkbox'

interface Props {
  onClose: ()=> void
}

export interface ISpecializationModalProps {
  manyItems?: boolean
  onSubmit?: (specialization: ISpecializationCategory|ISpecializationCategory[])=>void
}



export default function SpecializationModal(props: Props) {

  const cvContext = useCreateVcCvContext()
  const {activeCategory, activeSubCategory, setActiveCategory, setActiveSubcategory} = cvContext
  const appContext = useAppContext()
  const args = appContext.modalArguments as ISpecializationModalProps
  const [chooseAll, setChooseAll] = useState<boolean>(false)


  const scrollBar = useRef<Scrollbars>(null!)

  const submit = (data: {specialization: ISpecializationCategory|ISpecializationCategory[]}) => {
    if(!data.specialization) {
      appContext.showSnackbar('Выберите специализацию', SnackbarType.error)
      return
    }
    cvContext.setActiveSubcategory(data.specialization )
    cvContext.setActiveCategory(null)
    args.onSubmit&&args?.onSubmit(data.specialization)
    props.onClose()
  } 

  const formik = useFormik<{specialization: ISpecializationCategory|ISpecializationCategory[]}>({
    initialValues: {
      specialization: args.manyItems?[]:undefined,
    },
    onSubmit: submit
  })

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

  const chooseAllHandler = (subCategories: ISpecializationCategory[]) => {
    if(!chooseAll) {
      formik.setFieldValue('specialization', subCategories)
      setChooseAll(true)
    }
    else {
      formik.setFieldValue('specialization', Array.isArray(formik.values.specialization)&&formik.values.specialization.filter(f=> !subCategories.includes(f)))
      setChooseAll(false)
    }
  }


  useEffect(()=>{
    cvContext.setCategories()
  }, [])


  const body = (
    <Body 
    onClose={props.onClose} 
    onSave={formik.submitForm} 
    title={'Специализации'}
    withInput={false}
    >
      <FormikProvider value={formik}>
        <Form>
        <div className={styles.categoriesWrapper}>
        <Scrollbars ref={scrollBar} style={{height: '100%'}} autoHide universal>
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
                {subCategories && args?.manyItems &&
                  <>
                    {subCategories.length > 1 &&
                      <Checkbox className={styles.chooseAll} value={undefined} isActive={chooseAll} onChange={()=>chooseAllHandler(subCategories)} label='Выбрать все'/>
                    }
                    <div onClick={()=>setChooseAll(false)}>
                      {subCategories.length > 0 &&
                        <CheckboxListField rootClass={styles.radiosField} name={'specialization'} options={subCategories.map(el=> {
                          return {value: el, label: el.name}
                        })}/>
                      }
                    </div>
                  </>
                  ||
                  subCategories && !args?.manyItems &&
                  <RadioListField rootClass={styles.radiosField} name={'specialization'} options={subCategories.map(el=> {
                    return {value: el, label: el.name}
                  })}/>
                }
              </div>
            </div>
          )
        })}
        </Scrollbars>
      </div>  
        </Form>
      </FormikProvider>
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