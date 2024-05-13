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
  bottomSheetClassName?: string
  itemWrapperClassName?: string
} 

interface Props extends IOptionsModalProps{
  onClose: ()=>void
  isBottomSheet?: boolean
  isLast?: boolean
  setRef?: (r: HTMLDivElement) => void
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
  const args: IOptionsModalProps = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments 
  const title = props.title||args?.title  
  const children = props.children||args?.children

  const head = (<ClosingTitle title={title} onClose={props.onClose}/>)

  const hideModal = () => {
    props.isBottomSheet&&appContext.hideBottomSheet()
  }

  const body = (
    <div ref={r=>props.setRef?.(r)} className={classNames(styles.itemWrapper, args?.itemWrapperClassName)} onClick={hideModal}>
      {children}
    </div>
  )

  if (props.isBottomSheet) {
    return (
      <BottomSheetLayout className={args.bottomSheetClassName}>
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