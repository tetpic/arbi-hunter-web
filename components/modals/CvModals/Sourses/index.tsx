import styles from './index.module.scss'

import classNames from 'classnames'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { ISource } from 'data/interfaces/Common'
import { useState } from 'react'
import Body from '../Body'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import { useAppContext } from 'context/state'

interface Props {
  onClose: ()=> void
  isBottomSheet?: boolean
}

export interface ISoursesModalArgs{
  type: 'sources'|'geos'|'verticals'
  onSubmit?: (activeElements: Map<number, ISource>)=> void
  data?: ISource[] 
  choosenElements?: Map<number, ISource>
}


export default function SourcesModal(props: Props) {
  const appContext = useAppContext()
  const args: ISoursesModalArgs = props.isBottomSheet?appContext.bottomSheetArguments: appContext.modalArguments
  const [choosenElements, setChoosenElement] = useState<Map<number, ISource>>(args.choosenElements||new Map())

  const saveSourcesHandler = () => {
    args.onSubmit?.(choosenElements)
  }

  const onElementClickHandler = (e: ISource) => {
    if(!choosenElements.has(e.id)) {
      setChoosenElement(state =>  new Map(state.set(e.id, e)))
    }
    else {
      setChoosenElement(state => {
        state.delete(e.id)
        return new Map(state)
      })
    }
  }


  const title = (
    args.type === 'sources' && 'Источники трафика:'
    ||
    args.type === 'geos' && 'Гео:'
    ||
    args.type === 'verticals' && 'Вертикали:'
  )

  const body = (
    <Body 
    withInput={false}
    onClose={()=>{
      props.onClose()
    }}
    onSave={()=>{
      
      saveSourcesHandler()
    }}
    >
      <p className={styles.title}>{title}</p>
      <div className={styles.wrapper} data-cy={'sources_wrapper'}>
        {args.data?.length>0&&
          args.data.map(el=> 
            <p 
            key={el.id}
            className={classNames(styles.source, choosenElements.has(el.id)&&styles.source_active)} 
            onClick={()=> {onElementClickHandler(el)}}
            >
              {el.title}
            </p>
          )
        }
      </div>
    </Body>
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