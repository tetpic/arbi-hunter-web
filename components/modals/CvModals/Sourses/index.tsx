import styles from './index.module.scss'

import classNames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { ISource } from 'data/interfaces/Common'
import CvRepository from 'data/repositories/CvRepository'
import { useEffect, useState } from 'react'
import Body from '../Body'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import { useAppContext } from 'context/state'

interface Props {
  onClose: ()=> void
  isBottomSheet?: boolean
}

export interface ISoursesModalArgs {
  type: 'sources'|'geos'|'verticals'
  onClose?: ()=> void
}

export default function SoursesModal(props: Props) {
  const cvContext = useCreateVcCvContext()
  const appContext = useAppContext()
  const args: ISoursesModalArgs = props.isBottomSheet?appContext.bottomSheetArguments: appContext.modalArguments

  const [sources, setSources] = useState<ISource[]>(cvContext?.helpObjects?.sources||[])
  const [geos, setGeos] = useState<ISource[]>(cvContext?.helpObjects?.geos||[])
  const [verticals, setVerticals] = useState<ISource[]>(cvContext?.helpObjects?.verticals||[])

  const [choosenSources, setChoosenSources] = useState<Map<number, ISource>>(cvContext?.helpObjects?.activeSources||new Map())
  const [choosenGeos, setChoosenGeos] = useState<Map<number, ISource>>(cvContext?.helpObjects?.activeGeos||new Map())
  const [choosenVerticals, setChoosenVerticals] = useState<Map<number, ISource>>(cvContext?.helpObjects?.activeVerticals||new Map())

  useEffect(()=>{
    if(cvContext?.helpObjects?.sources.length === 0) {
      CvRepository.sourcesList()
      .then(res => {
        setSources(res.data)
        const cvHelpState = cvContext.helpObjects
        cvContext.setHelpObjects({...cvHelpState, sources: res.data})
      })
      CvRepository.getGeos()
      .then(res => {
        setGeos(res.data)
        const cvHelpState = cvContext.helpObjects
        cvContext.setHelpObjects({...cvHelpState, geos: res.data})
      })
      CvRepository.getVerticals()
      .then(res =>{
        setVerticals(res.data)
        const cvHelpState = cvContext.helpObjects
        cvContext.setHelpObjects({...cvHelpState, verticals: res.data})
      })

    }
  }, [cvContext?.helpObjects?.sources])

  const saveSourcesHandler = () => {
    const cvHelpState = cvContext.helpObjects
    cvContext.setHelpObjects({...cvHelpState, activeSources: choosenSources, activeGeos: choosenGeos, activeVerticals: choosenVerticals})
    args?.onClose?args?.onClose():props.onClose()
  }

  const onSourceClickHandler = (e: ISource) => {
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

  const onGeoClickHandler = (e: ISource) => {
    if(!choosenGeos.has(e.id)) {
      setChoosenGeos(state =>  new Map(state.set(e.id, e)))
    }
    else {
      setChoosenGeos(state => {
        state.delete(e.id)
        return new Map(state)
      })
    }
  }
  
  const onVerticalClickHandler = (e: ISource) => {
    if(!choosenVerticals.has(e.id)) {
      setChoosenVerticals(state =>  new Map(state.set(e.id, e)))
    }
    else {
      setChoosenVerticals(state => {
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

  useEffect(()=>{
    if(cvContext?.helpObjects?.activeVerticals) {
      setChoosenVerticals(cvContext.helpObjects.activeVerticals)    
    }
  }, [cvContext?.helpObjects?.activeVerticals])

  useEffect(()=>{
    if(cvContext?.helpObjects?.activeGeos) {
      setChoosenGeos(cvContext.helpObjects.activeGeos)    
    }
  }, [cvContext?.helpObjects?.activeGeos])

  const body = (
    <>
    <Body 
    withInput={false}
    onClose={props.onClose}
    onSave={saveSourcesHandler}
    >
      {args.type === 'sources' && <>
        <p className={styles.title}>Источники трафика:</p>
        <div className={styles.wrapper}>
          {sources?.length>0&&sources
          .map(el=> 
            <p 
            key={el.id}
            className={classNames(styles.source, choosenSources.has(el.id)&&styles.source_active)} 
            onClick={()=> {onSourceClickHandler(el)}}
            >
                {el.title}
              </p>
          )}
        </div>
      </>}

      {args.type === 'geos' && <>
        <p className={styles.title}>Гео:</p>
        <div className={styles.wrapper}>
          {geos?.length>0&&geos
          .map(el=> 
            <p 
            key={el.id}
            className={classNames(styles.source, choosenGeos.has(el.id)&&styles.source_active)} 
            onClick={()=> {onGeoClickHandler(el)}}
            >
                {el.title}
              </p>
          )}
        </div>
      </>}

      {args.type === 'verticals' && <>
        <p className={styles.title}>Вертикали:</p>
        <div className={styles.wrapper}>
          {verticals?.length>0&&verticals
          .map(el=> 
            <p 
            key={el.id}
            className={classNames(styles.source, choosenVerticals.has(el.id)&&styles.source_active)} 
            onClick={()=> {onVerticalClickHandler(el)}}
            >
                {el.title}
              </p>
          )}
        </div>
      </>}

    </Body>
    </>
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
    <ModalLayout mobileFullScreen className={styles.rootLayout}>
      <ModalBody>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}