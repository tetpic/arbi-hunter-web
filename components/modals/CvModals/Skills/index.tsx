import { useThrottleFn } from '@react-cmpt/use-throttle'
import classnames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import CustomScrollbar from 'components/ui/CustomScrollbar'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useAppContext } from 'context/state'
import { ISource } from 'data/interfaces/Common'
import SkillsRepository from 'data/repositories/SkillsRepository'
import { ChangeEvent, useState } from 'react'
import { SnackbarType } from 'types/enums'
import Body from '../Body'
import styles from '../index.module.scss'

interface Props {
  onClose: () => void
}

export default function SkillsModal(props: Props) {
  
  const cvContext = useCreateVcCvContext()
  const appContext = useAppContext()

  const [skills, setSkills] = useState<ISource[]>(cvContext.helpObjects?.skills||[])
  const [choosenSkill, setChoosenSkill] = useState<ISource[]>([])

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>)=> {
    const value = e.target.value
    if(value.length === 0) {return}
    SkillsRepository.findSkill(e.target.value)
    .then(res => {
      setSkills(res.data)     
    })
    .catch(err=>{
      
    })
  }
  const withTrottle = useThrottleFn(onChangeHandler, 300)

  const setSkillHandler = () => {
    if(!choosenSkill&&choosenSkill.length === 0) {
      appContext.showSnackbar('Выберите специализацию из списка', SnackbarType.error)
      return
    }
    
    const helperSkills = cvContext.helpObjects?.skills||[]
    cvContext.setHelpObjects({skills: [...helperSkills, ...choosenSkill]})
    setChoosenSkill([])
    props.onClose()
  }

  const onClickHandler = (el: ISource) => {
    setChoosenSkill(state => {
      const indexFound = state.findIndex(e=> e===el)
      if(indexFound >= 0) {
        return state.filter(e => el !== e)
      } else {
        return [...state, el]
      }
    })
  }

  const body = (
    <Body 
      onChange={withTrottle.callback} 
      onClose={props.onClose} 
      onSave={setSkillHandler} 
      title={'Навыки'}
      placeholder={'Поиск по навыкам'}
      >
        <div className={styles.categoriesWrapper}>
          <CustomScrollbar>
          {skills&&skills.length > 0&&skills.map(el=>{
            return (<p className={classnames(styles.position, choosenSkill.findIndex(e => el === e)>=0&&styles.position_active)} onClick={()=>onClickHandler(el)}>{el.title}</p>)
          })}
          </CustomScrollbar>
        </div>
      </Body>
    )


  return ( 
    <ModalLayout className={styles.rootLayout}>
      <ModalBody>
        {body}
      </ModalBody>
    </ModalLayout>

  )
}