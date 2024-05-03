import P from '@/components/ui/P'
import styles from './index.module.scss'

import classNames from 'classnames'
import CheckSvg from 'components/svg/CheckSvg'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
interface Props<T> {
  value: T,
  isActive: boolean
  label?: string|JSX.Element|JSX.Element[],
  className?: string
  activeClassName?: string
  circleClassName?: string
  children?: any
  onChange: (value: T) => void
  labelClassName?: string
  name?: string
}

/**
 * @value T,
 * @isActive boolean
 * @label  string,
 * @className  string
 * @activeClassName  string
 * @circleClassName  string
 * @children  any
 * @onChange (value: T) => void
 * @labelClassName  string
 */
export default function Checkbox<T>(props: Props<T>) {
  const {theme} = useAppContext()
  const isLightTheme = theme === AppTheme.Light
  const handleClick = () => {
    
    props.onChange(props.value)
  }
  return (
    <div className={classNames(styles.root, isLightTheme&&styles.root_light, {[styles.active]: props.isActive}, props.className, {[props.activeClassName]: props.isActive})} onClick={handleClick} data-cy={'checkbox_'+props.name}>
      <div className={classNames(styles.circle, isLightTheme&&styles.circle_light, props.circleClassName)}>{props.isActive && <CheckSvg color={'white'}/>}</div>
      {props.children && props.children.length ? props.children : <P useThemeColor styleType={['medium', 'w500']} className={classNames(styles.label, props.labelClassName)}>{props.label}</P>}
    </div>
  )
}
