import styles from '../index.module.scss'

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
import SectionSubtitle from '@/components/for_pages/create/utils/SectionSubtitle'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: () => void
}

export interface ISkillModalProps {
  onSubmit?: (data: Map<number, ISource>)=>void
  onClose?: ()=>void
  choosenSkills?:  Map<number, ISource>
}

export default function SkillsModal(props: Props) {
  const {t} = useTranslation() 
  
  const appContext = useAppContext()
  const args: ISkillModalProps = appContext.modalArguments

  const [skills, setSkills] = useState<Map<number, ISource>>(new Map)
  const [choosenSkills, setChoosenSkills] = useState<Map<number, ISource>>(args.choosenSkills||new Map)

  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [value, setValue] = useState<string>('')

  const onChangeHandler = (e?: ChangeEvent<HTMLInputElement>)=> {
    const value = e?.target?.value||''
    setValue(value)
    setPage(1)
  }

  const withTrottle = useThrottleFn(onChangeHandler, 300)

  const setSkillHandler = () => {
    if(!choosenSkills&&choosenSkills.size === 0) {
      appContext.showSnackbar(t('create_setSkills'), SnackbarType.error)
      return
    }
    args.onSubmit(choosenSkills)
    setChoosenSkills(new Map)
    props.onClose()
  }

  useEffect(()=>{
    SkillsRepository.findSkill(value, page)
    .then(res=>{
      const sorted = res.data.sort((a, b)=> (a.title > b.title)?1:-1)
      setSkills(state=> {
        if(page === 1) {
          state.clear()
        }
        sorted.forEach(el => {
          state.set(el.id, el)
        })
        return new Map(state)
      })
      setTotal(res.total)
    })
  }, [page, value])

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
    title={t('create_cv_skills')}
    placeholder={t('create_findSkills')}
    >
      <div className={styles.categoriesWrapper}>

        <InfiniteScroll
        height={'100%'}
        next={()=>setPage(p => p+1)}
        hasMore={skills.size < total}
        loader={<Spinner size={24} />}  
        dataLength={skills.size}  
        >
          <div className={styles.categories}>
            {choosenSkills&&choosenSkills.size > 0 &&<>
            <SectionSubtitle text={t('create_choosenSkills')} className={styles.title}/>

            {[...choosenSkills.values()].map((el, index)=>{
              return (<p key={index} className={classnames(styles.position, choosenSkills.has(el.id)&&styles.position_active)} onClick={()=>onClickHandler(el)}>{el.title}</p>)
            })}
            <p className={styles.spacer}></p>
            </>}

            {skills&&skills.size > 0&&[...skills.values()].filter(s=> !choosenSkills.get(s.id)).map((el, index)=>{
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
