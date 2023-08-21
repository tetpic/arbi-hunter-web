import styles from './index.module.scss'
import { MouseEventHandler } from 'react'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'

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
    <button onClick={props.onClick} className={styles.root} type='button'>
      <ArrowDownSvg className={styles.arrow}/>
    </button>
  )
}

BackBtn.defaultProps = {
  size: 'medium'
}

