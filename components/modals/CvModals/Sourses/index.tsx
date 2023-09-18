import classNames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { ISource } from 'data/interfaces/Common'
import CvRepository from 'data/repositories/CvRepository'
import { useEffect, useState } from 'react'
import Body from '../Body'
import styles from './index.module.scss'

interface Props {
  onClose: ()=> void
}

export default function SoursesModal(props: Props) {
    
  const cvContext = useCreateVcCvContext()

  const [sources, setSources] = useState<ISource[]>(cvContext?.helpObjects?.sources||[])
  const [choosenSources, setChoosenSources] = useState<Map<number, ISource>>(cvContext?.helpObjects?.activeSources||new Map())

  useEffect(()=>{
    
    if(cvContext?.helpObjects?.sources.length === 0) {
      CvRepository.sourcesList().then(res=> {
        setSources(res.data)
        const cvHelpState = cvContext.helpObjects
        cvContext.setHelpObjects({...cvHelpState, sources: res.data})
      })
    }
  }, [cvContext?.helpObjects?.sources])

  const saveSourcesHandler = () => {
    const cvHelpState = cvContext.helpObjects
    cvContext.setHelpObjects({...cvHelpState, activeSources: choosenSources})
    props.onClose()
  }

  const onClickItemHandler = (e: ISource) => {
    if(!choosenSources.has(e.id)) {
      setChoosenSources(state =>  new Map(state.set(e.id, e)))
    }
    else {
      setChoosenSources(state => {
        state.delete(e.id)
        return new Map(state)
      })
    }
  }

  useEffect(()=>{
    if(cvContext?.helpObjects?.activeSources) {
      setChoosenSources(cvContext.helpObjects.activeSources)    
    }
  }, [cvContext?.helpObjects?.activeSources])

  const body = (
    <Body 
    withInput={false}
    onClose={props.onClose}
    onSave={saveSourcesHandler}
    title='Источники трафика:'
    >
      <div className={styles.wrapper}>
        {sources?.length>0&&sources
        .map(el=> 
            <p 
            className={classNames(styles.source, choosenSources.has(el.id)&&styles.source_active)} 
            onClick={()=> {onClickItemHandler(el)}}
            >
              {el.title}
            </p>
        )}
      </div>
    </Body>
  )

  return ( 
    <ModalLayout mobileFullScreen className={styles.rootLayout}>
      <ModalBody>
        {body}
      </ModalBody>
    </ModalLayout>
    

  )
}