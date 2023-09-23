import styles from './index.module.scss'
import { MouseEventHandler } from 'react'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import classNames from 'classnames'

interface Props {
  onClick: MouseEventHandler
  defaultPosition?: boolean
  color?: string
  className?: string
  bgColor: 'transparent' | 'white'
  size?: 'normal' | 'medium' | 'large'
}

export default function BackBtn(props: Props) {
  return (
    <button onClick={props.onClick} className={classNames(styles.root, props.className)} type='button'>
      <ArrowDownSvg className={styles.arrow}/>
    </button>
  )
}

BackBtn.defaultProps = {
  size: 'medium'
}

