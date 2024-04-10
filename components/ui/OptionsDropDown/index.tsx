import classNames from 'classnames'
import styles from './index.module.scss'
import OptionsModal from 'components/modals/OptionsModal'

interface Props {
  options: JSX.Element|JSX.Element[]
  active: boolean
  isLast?: boolean
  getRef:(r: HTMLDivElement) => void
  onClose: () => void
  className?: string
}

export default function OptionsDropDown(props: Props) {

  return (<div ref={r=> props.getRef(r)} className={classNames(styles.modalWrapper, props.active&&styles.modalWrapper_active, props.className)}>
  <OptionsModal isLast={props.isLast}  onClose={props.onClose}>
    {props.options}
  </OptionsModal>
</div>)
}