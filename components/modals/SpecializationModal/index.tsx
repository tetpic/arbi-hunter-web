import { useThrottleFn } from '@react-cmpt/use-throttle'
import classnames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import LoupeSvg from 'components/svg/LoupeSvg'
import Button from 'components/ui/Button'
import { useCvContext } from 'context/cv_state'
import { useAppContext } from 'context/state'
import { IPosition } from 'data/interfaces/ICV'
import CvRepository from 'data/repositories/CvRepository'
import { ChangeEvent, useState } from 'react'
import { SnackbarType } from 'types/enums'
import styles from './index.module.scss'

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

  const setSpecHandler = () => {
    if(!choosenSpec&&!choosenSpec?.position) {
      appContext.showSnackbar('Выберите специализацию из списка', SnackbarType.error)
      return
    }
    const currentCv = cvContext.currentCv
    cvContext.setCurrentCv({...currentCv, position: choosenSpec.position}) 
    props.onClose()
  }

  const withTrottle = useThrottleFn(onChangeHandler, 300)

  const title = (<p className={styles.title}>Специализации</p>)

  const body = (<>
  <div className={styles.inputWrapper}>
    <LoupeSvg className={styles.loupeSvg}/>
    <input className={styles.input} type="text" onChange={(e)=> withTrottle.callback(e)} placeholder='Поиск по специализации' />
  </div>
  <div className={styles.positionsWrapper}>
    {specs&&specs.length > 0&&specs.map(el=>{
      return (<p className={classnames(styles.position, el===choosenSpec&&styles.position_active)} onClick={()=>setChoosenSpec(el)}>{el.position}</p>)
    })}
  </div>
  <div className={styles.buttonsWrapper}>
    <Button className={styles.button} onClick={props.onClose} >Отменить</Button>
    <Button className={styles.buttonYellow} onClick={setSpecHandler} title={'Выберите позицию из списка'}>Выбрать</Button>
  </div>
  </>)



  return ( 
    <ModalLayout className={styles.rootLayout} >
      <ModalBody>
        {title}
        {body}
      </ModalBody>
    </ModalLayout>

  )
}