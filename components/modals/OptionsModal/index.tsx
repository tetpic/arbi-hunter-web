import styles from './index.module.scss'

import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import ClosingTitle from 'components/ui/ClosingTitle'
import { useAppContext } from 'context/state'
import {  MutableRefObject,  useState } from 'react'
import classNames from 'classnames'
import { Placement, } from '@popperjs/core'
import { usePopper } from 'react-popper'



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
  usePopperRoot?: HTMLElement
  popperPlacement?: Placement
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
  const [popperElement, setPopperElement] = useState(null)
  const popper = usePopper(props.usePopperRoot, popperElement, {placement: props.popperPlacement||'bottom', modifiers: [
    {name: 'offset', options: {offset: [10, 10]}},
    {name: 'flip',enabled: true},

  ]})



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
    <div 
    className={classNames(props.usePopperRoot?styles.outerWithPopper:styles.outer, props.isLast&&styles.outer_last)} 
    ref={(r)=>{setPopperElement?.(r)}} 
    style={props.usePopperRoot&&popper.styles.popper}  {...popper.attributes.popper} 
    >
      {/* {head} */}
      {body}
    </div>
  )
}