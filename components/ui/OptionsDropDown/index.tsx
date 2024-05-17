import classNames from 'classnames'
import styles from './index.module.scss'
import OptionsModal from 'components/modals/OptionsModal'
import { Placement, } from '@popperjs/core'
import {  useState } from 'react'



interface Props {
  options: JSX.Element|JSX.Element[]
  active: boolean
  isLast?: boolean
  getRef?:(r: HTMLDivElement) => void
  onClose: () => void
  className?: string
  usePopper?: boolean
  popperPlacement?: Placement
  
}

export default function OptionsDropDown(props: Props) {
  const [popperRoot, setPopperRoot] = useState<HTMLElement>()

  return (<div 
  ref={r=> {props.getRef(r); setPopperRoot(r)}}  
  className={classNames(
    props.usePopper?styles.modalWrapperWithPopper:styles.modalWrapper, 
    props.active&&(props.usePopper?styles.modalWrapperWithPopper_active:styles.modalWrapper_active), 
    props.className
  )}
  >
  <OptionsModal 
  isLast={props.isLast} 
  usePopperRoot={props.usePopper&&popperRoot} 
  popperPlacement={props.popperPlacement}   
  onClose={props.onClose}>
    {props.options}
  </OptionsModal>
</div>)
}