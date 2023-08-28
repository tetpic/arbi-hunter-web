import { useThrottleFn } from '@react-cmpt/use-throttle'
import classnames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { useCvContext } from 'context/cv_state'
import { useAppContext } from 'context/state'
import { IPosition } from 'data/interfaces/ICV'
import CvRepository from 'data/repositories/CvRepository'
import { ChangeEvent, useState } from 'react'
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

  const body = (
  <Body 
    onChange={withTrottle.callback} 
    onClose={props.onClose} 
    onSave={setSpecHandler} 
    title={'Специализации'}
    placeholder={'Поиск по специализации'}
    >
     {specs&&specs.length > 0&&specs.map(el=>{
        return (<p className={classnames(styles.position, el===choosenSpec&&styles.position_active)} onClick={()=>setChoosenSpec(el)}>{el.position}</p>)
      })}
    </Body>
  )

  return ( 
    <ModalLayout className={styles.rootLayout} >
      <ModalBody>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}