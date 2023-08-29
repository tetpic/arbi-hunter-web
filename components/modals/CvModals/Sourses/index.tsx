import classNames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { useCvContext } from 'context/cv_state'
import { Source } from 'data/interfaces/ICV'
import CvRepository from 'data/repositories/CvRepository'
import { useEffect, useState } from 'react'
import Body from '../Body'
import styles from './index.module.scss'

interface Props {
  onClose: ()=> void
}

export default function SoursesModal(props: Props) {
    
  const cvContext = useCvContext()

  const [sources, setSources] = useState<Source[]>(cvContext?.helpObjects?.sources||[])
  const [choosenSources, setChoosenSources] = useState<Set<Source>>(cvContext?.helpObjects?.activeSources||new Set())

  useEffect(()=>{
    if(!cvContext?.helpObjects?.sources) {
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

  const onClickItemHandler = (e: Source) => {
    if(!choosenSources.has(e)) {
      setChoosenSources(state =>  new Set(state.add(e)))
    }
    else {
      setChoosenSources(state => {
        state.delete(e)
        return new Set(state)
      })
    }
  }

  useEffect(()=>{
    choosenSources
  }, [choosenSources])

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
            className={classNames(styles.source, choosenSources.has(el)&&styles.source_active)} 
            onClick={()=> {onClickItemHandler(el)}}
            >
              {el.title}
            </p>
        )}
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