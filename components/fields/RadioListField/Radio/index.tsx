import styles from './index.module.scss'
import classNames from 'classnames'
import CheckSvg from 'components/svg/CheckSvg'
interface Props<T> {
  value: T,
  isActive: boolean
  label?: string,
  className?: string
  activeClassName?: string,
  children?: any
  onChange: (value: T) => void
  labelClassName?: string,
  circleClassName? : string
}
export default function Radio<T>(props: Props<T>) {
  const handleClick = () => {
    props.onChange(props.value)
  }
  return (
    <div className={classNames(styles.root, props.isActive&&styles.active, props.className, props.isActive&&props.activeClassName)} onClick={handleClick}>
      <div className={classNames(styles.circle, props.circleClassName)}>{props.isActive && <CheckSvg color={'black'}/>}</div>
      {props.children && props.children.length ? props.children : <div className={classNames(styles.label, props.labelClassName)}>{props.label}</div>}
    </div>
  )
}
