import { useThrottleFn } from '@react-cmpt/use-throttle'
import classnames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { useAppContext } from 'context/state'
import { ISource } from 'data/interfaces/Common'
import SkillsRepository from 'data/repositories/SkillsRepository'
import { ChangeEvent, useEffect, useState } from 'react'
import { SnackbarType } from 'types/enums'
import Body from '../Body'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from 'components/ui/Spinner'
import styles from '../index.module.scss'

interface Props {
  onClose: () => void
}

export interface ISkillModalProps {
  onSubmit?: (data: Map<number, ISource>)=>void
  onClose?: ()=>void
  choosenSkills?:  Map<number, ISource>
}

export default function SkillsModal(props: Props) {
  
  const appContext = useAppContext()
  const args: ISkillModalProps = appContext.modalArguments

  const [skills, setSkills] = useState<ISource[]>([])
  const [choosenSkills, setChoosenSkills] = useState<Map<number, ISource>>(new Map)
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
        const filtered = res.data.filter(el=>!args.choosenSkills.get(el.id))
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
    if(!choosenSkills&&choosenSkills.size === 0) {
      appContext.showSnackbar('Выберите навык из списка', SnackbarType.error)
      return
    }
    args.onSubmit(choosenSkills)
    setChoosenSkills(new Map)
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
    let clicked: boolean = true
    setChoosenSkills(state => {
      if(clicked) {
        if(state.has(el.id)) {
        state.delete(el.id)
        }
        else {
          state.set(el.id, el)      
        }
        clicked = false
        return new Map(state)
      }
      else {
        return new Map(state)
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
        loader={<Spinner size={24} />}  
        dataLength={skills.length}  
        >
          <div className={styles.categories}>
            {skills&&skills.length > 0&&skills.filter(s=> !args.choosenSkills.get(s.id)).map((el, index)=>{
              return (<p key={index} className={classnames(styles.position, choosenSkills.has(el.id)&&styles.position_active)} onClick={()=>onClickHandler(el)}>{el.title}</p>)
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
