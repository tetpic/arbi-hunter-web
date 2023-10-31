import { useThrottleFn } from '@react-cmpt/use-throttle'
import classnames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useAppContext } from 'context/state'
import { ISource } from 'data/interfaces/Common'
import SkillsRepository from 'data/repositories/SkillsRepository'
import { ChangeEvent, useEffect, useState } from 'react'
import { SnackbarType } from 'types/enums'
import Body from '../Body'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import styles from '../index.module.scss'

interface Props {
  onClose: () => void
}

export default function SkillsModal(props: Props) {
  
  const cvContext = useCreateVcCvContext()
  const appContext = useAppContext()

  const [skills, setSkills] = useState<ISource[]>([])
  const [choosenSkill, setChoosenSkill] = useState<ISource[]>([])
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const onChangeHandler = (e?: ChangeEvent<HTMLInputElement>)=> {
    const value = e?.target?.value||null
    if(!e || value?.length === 0) {
      setSkills([])
      setPage(1)
    } else {
      SkillsRepository.findSkill(e.target.value)
      .then(res => {
        const filtered = res.data.filter(el=>!cvContext.helpObjects.skills.has(el.id))
        setSkills(filtered)  
        setPage(1)   
        setTotal(filtered.length)
      })
      .catch(err=>{
        appContext.showSnackbar(err.toString(), SnackbarType.error)
      })
    }
  }
  const withTrottle = useThrottleFn(onChangeHandler, 300)

  const setSkillHandler = () => {
    if(!choosenSkill&&choosenSkill.length === 0) {
      appContext.showSnackbar('Выберите специализацию из списка', SnackbarType.error)
      return
    }
    const helperSkills = cvContext.helpObjects?.skills||new Map
    cvContext.setHelpObjects({skills: new Map([...helperSkills.values(), ...choosenSkill].map(el=>[el.id, el]))})
    setChoosenSkill([])
    props.onClose()
  }

  useEffect(()=>{
    if(skills.length<total||skills.length === 0) {
      SkillsRepository.findSkill(null, page)
      .then(res=>{
        const sorted = res.data.sort((a, b)=> (a.title > b.title)?1:-1)
        setSkills(state=> [...state, ...sorted])
        setTotal(res.total)
      })
    }
  }, [page])

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
        <InfiniteScroll
        height={'100%'}
        next={()=>setPage(p => p+1)}
        hasMore={skills.length < total}
        loader={<Spinner size={24} color={colors.yellow} />}  
        dataLength={skills.length}  
        >
          <div className={styles.categories}>
            {skills&&skills.length > 0&&skills.filter(s=> !cvContext.helpObjects.skills.has(s.id)).map((el, index)=>{
              return (<p key={index} className={classnames(styles.position, choosenSkill.findIndex(e => el === e)>=0&&styles.position_active)} onClick={()=>onClickHandler(el)}>{el.title}</p>)
            })}
          </div>
        </InfiniteScroll>
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