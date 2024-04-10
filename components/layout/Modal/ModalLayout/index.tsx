import styles from './index.module.scss'
import classNames from 'classnames'
import {ReactElement} from 'react'
import {useAppContext} from 'context/state'


interface Props {
  fixed?: boolean
  children?: ReactElement | ReactElement[]
  className?: string,
  backgroundColor? : string
  mobileFullScreen?:boolean
}

/**
  * @fixed boolean
  * @children ReactElement | ReactElement[]
  * @className string,
  * @backgroundColor string
  * @mobileFullScreen boolean
 */
export default function ModalLayout(props: Props) {
  const {theme, ...context} = useAppContext()

  return (
    <div 
      className={classNames(styles.root, styles[theme], {[styles.fixed]: props.fixed || context.isMobile}, props.className, props.mobileFullScreen&&styles.fullScreen)}
      style={{background: props.backgroundColor}}
    >
      {props.children}
    </div>
    )
}
