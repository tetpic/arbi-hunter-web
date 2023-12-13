import classNames from 'classnames'
import styles from './index.module.scss'
import OptionsModal from 'components/modals/OptionsModal'

interface Props {
  options: JSX.Element|JSX.Element[]
  active: boolean
  isLast?: boolean
  getRef:(r: HTMLDivElement) => void
  onClose: () => void
}

export default function OptionsDropDown(props: Props) {

  return (<div ref={r=> props.getRef(r)} className={classNames(styles.modalWrapper, props.active&&styles.modalWrapper_active)}>
  <OptionsModal isLast={props.isLast}  onClose={props.onClose}>
    {props.options}
  </OptionsModal>
</div>)
}