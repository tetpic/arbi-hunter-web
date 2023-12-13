import styles from './index.module.scss'

import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import ClosingTitle from 'components/ui/ClosingTitle'
import { useAppContext } from 'context/state'
import { MutableRefObject } from 'react'
import classNames from 'classnames'


export interface IOptionsModalProps {
  title?: string
  children?: JSX.Element|JSX.Element[]
  ref?: MutableRefObject<HTMLDivElement>
} 

interface Props extends IOptionsModalProps{
  onClose: ()=>void
  isBottomSheet?: boolean
  isLast?: boolean
}



/**
 * @onClose ()=>void
 * @isBottomSheet boolean
 * @outerData {cv?: ICV, vc?: IVacancy} 
 * @ref MutableRefObject<HTMLDivElement>
 * @isLast boolean
 */
export default function OptionsModal(props: Props) {
  
  const appContext = useAppContext()
  const args = appContext.modalArguments as IOptionsModalProps
  const title = props.title||args?.title  
  const children = props.children||args?.children

  const head = (<ClosingTitle title={title} onClose={props.onClose}/>)

  const hideModal = () => {
    props.isBottomSheet&&appContext.hideBottomSheet()
  }

  const body = (
    <div className={styles.itemWrapper} onClick={hideModal}>
      {children}
    </div>
  )

  if (props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          {head}
          {body}
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }

  return (
    <div className={classNames(styles.outer, props.isLast&&styles.outer_last)} ref={props.ref}>
      {/* {head} */}
      {body}
    </div>
  )
}