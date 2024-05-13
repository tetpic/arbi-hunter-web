import classNames from 'classnames'
import styles from './index.module.scss'
import OptionsModal from 'components/modals/OptionsModal'
import { useDropDown } from '@/components/hooks/useDropDown'
import { useEffect } from 'react'

interface Props {
  options: JSX.Element|JSX.Element[]
  active: boolean
  isLast?: boolean
  getRef?:(r: HTMLDivElement) => void
  onClose: () => void
  className?: string
  usePopper?: boolean
  rootRef?: React.MutableRefObject<any>
}

export default function OptionsDropDown(props: Props) {
  const {setRootRef, isActive, setIsActive, popperStyles, setPopperElement, attributes} = useDropDown({offset: [40, 16], placement: 'bottom', position: 'absolute'})


  useEffect(()=>{
    props.usePopper&&setRootRef(props.rootRef)
  }, [])

  useEffect(()=>{
    props.usePopper&&setIsActive(props.active)
  }, [props.active])

  

  return (<div ref={r=> {props.getRef(r); setRootRef(r)}} style={props.usePopper?popperStyles.popper:{}} className={classNames(styles.modalWrapper, (props.usePopper?isActive:props.active)&&styles.modalWrapper_active, props.className)} {...attributes.popper}>
  <OptionsModal isLast={props.isLast} setRef={(r)=>setPopperElement(r)} onClose={props.onClose}>
    {props.options}
  </OptionsModal>
</div>)
}