import styles from '../index.module.scss'

import classnames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import { CreateVcCvWrapper,  useCreateVcCvContext,} from 'context/createVcCv_state'
import { ISpecializationCategory } from 'data/interfaces/Common'
import {  useRef, useState } from 'react'
import Body from '../Body'
import Scrollbars from 'react-custom-scrollbars-2'
import { useAppContext } from 'context/state'
import { Form, FormikProvider, useFormik } from 'formik'
import CheckboxListField from 'components/fields/CheckboxListField'
import RadioListField from 'components/fields/RadioListField'
import { SnackbarType } from 'types/enums'
import Checkbox from 'components/fields/CheckboxListField/Checkbox'
import Spinner from 'components/ui/Spinner'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: ()=> void
  isBottomSheet?: boolean
}

export interface ISpecializationModalProps {
  manyItems?: boolean
  activeSubCategories?: ISpecializationCategory[]
  onSubmit?: (specialization: ISpecializationCategory[])=>void
  onClose?: ()=>void
}


function SpecializationModalInner(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const args:ISpecializationModalProps = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments
  const cvContext = useCreateVcCvContext()
  const {activeCategory, setActiveCategory} = cvContext
  const [chooseAll, setChooseAll] = useState<boolean>(false)
  const {t} = useTranslation()

  // useEffect(()=>{
  //   setActiveCategory(args.activeSubCategories)  
  // }, [])

  const scrollBar = useRef<Scrollbars>(null!)

  const submit = (data: {specialization: ISpecializationCategory|ISpecializationCategory[]}) => {
    if(!data.specialization && !args.manyItems) {
      appContext.showSnackbar(t('create_setSpecializationAlt'), SnackbarType.error)
      return
    }
    cvContext.setActiveSubcategory(Array.isArray(data.specialization)?data.specialization: [data.specialization])
    cvContext.setActiveCategory(null)
    args?.onSubmit?.(Array.isArray(data.specialization)?data.specialization: [data.specialization])
    args.onClose?args.onClose():props.onClose()
  } 

  const formik = useFormik<{specialization: ISpecializationCategory[]}>({
    initialValues: {
      specialization: [],
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
    cvContext.setSubcategoriesToCategory(el)
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

  const body = (
    <Body 
    onClose={props.onClose} 
    onSave={formik.submitForm} 
    title={t('filters_specializations')}
    withInput={false}
    disableBackButton={isTabletWidth}
    >
      <FormikProvider value={formik}>
        <Form>
        <div className={styles.categoriesWrapper}>
        <Scrollbars ref={scrollBar} style={{height: '100%'}} autoHide universal>
        {cvContext.categories  && Array.from(cvContext.categories.entries()).map(([category, subCategories],index)=> {
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
                      <Checkbox className={styles.chooseAll} value={undefined} isActive={chooseAll} onChange={()=>chooseAllHandler(subCategories)} label={t('setAll')}/>
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
        })
        ||
        <Spinner size={32} />
        }
        </Scrollbars>
      </div>  
        </Form>
      </FormikProvider>
    </Body>
  )

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          {body}
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }

  return ( 
    <ModalLayout className={styles.rootLayout} >
      <ModalBody className={styles.modalBody}>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}

export default function SpecializationModal(props: Props) {
  return <CreateVcCvWrapper>
    <SpecializationModalInner {...props} />
  </CreateVcCvWrapper>
}