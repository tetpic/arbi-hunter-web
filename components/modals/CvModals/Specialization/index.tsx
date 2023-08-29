import { useThrottleFn } from '@react-cmpt/use-throttle'
import classnames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import { useCvContext } from 'context/cv_state'
import { useAppContext } from 'context/state'
import { ICategory, IPosition } from 'data/interfaces/ICV'
import CvRepository from 'data/repositories/CvRepository'
import { ChangeEvent, useEffect, useState } from 'react'
import { SnackbarType } from 'types/enums'
import Body from '../Body'
import styles from '../index.module.scss'

interface Props {
  onClose: ()=> void
}

export default function SpecializationModal(props: Props) {

  const cvContext = useCvContext()
  const appContext = useAppContext()

  const [specs, setSpecs] = useState<IPosition[]>([])
  const [choosenSpec, setChoosenSpec] = useState<IPosition>()
  const [activeCategory, setActiveCategory] = useState<ICategory>()

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>)=> {
    const value = e.target.value
    if(value.length === 0) {return}
    CvRepository.sugestCVPosition(e.target.value)
    .then(res => {
      setSpecs(res)
      setChoosenSpec(null)
    })
    .catch(err=>{
      
    })
  }

  useEffect(()=>{
    cvContext.setCategories()
  }, [])

  const withTrottle = useThrottleFn(onChangeHandler, 300)

  const setSpecHandler = () => {
    if(!choosenSpec&&!choosenSpec?.position) {
      appContext.showSnackbar('Выберите специализацию из списка', SnackbarType.error)
      return
    }
    const currentCv = cvContext.currentCv
    cvContext.setCurrentCv({...currentCv, position: choosenSpec.position}) 
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

  const body = (
  <Body 
    onChange={withTrottle.callback} 
    onClose={props.onClose} 
    onSave={setSpecHandler} 
    title={'Специализации'}
    placeholder={'Поиск по специализации'}
    >
      <>
        {specs&&specs.length > 0&&specs.map(el=>{
         return (<p className={classnames(styles.position, el===choosenSpec&&styles.position_active)} onClick={()=>setChoosenSpec(el)}>{el.position}</p>)
        })}
        <div className={styles.categoriesWrapper}>
          {cvContext.categories && Array.from(cvContext.categories.entries()).map(([category, subCategories])=> {
            const isActive = activeCategory === category
            return (
              <div className={styles.category}>
                <p 
                className={classnames(styles.categoryTitle, isActive&&styles.categoryTitle_active)} 
                onClick={()=>categoryClickHandler(category)} 
                >
                  {category.name} 
                  <ArrowDownSvg className={classnames(styles.arrow, isActive&&styles.arrow_active)}/>
                </p>
                <div className={classnames(styles.subCategoryWrapper, isActive&&styles.subCategoryWrapper_active)}>
                  {subCategories && subCategories.map(el=> {
                    return <p className={styles.subCategoryItem}>{el.name}</p>
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </>
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