import styles from './index.module.scss'
import { MouseEventHandler } from 'react'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import classNames from 'classnames'
import Button, { ButtonStyle } from '../Button'

interface Props {
  onClick: MouseEventHandler
  defaultPosition?: boolean
  color?: string
  className?: string
  bgColor: 'transparent' | 'white'
  size?: 'normal' | 'medium' | 'large'
  altStyleType?:  ButtonStyle[]
}

export default function BackBtn(props: Props) {
  return (
    <Button styleType={['icon', 'black']} altStyleType={props.altStyleType||['icon', 'whitePurple', 'invertSvg']} onClick={props.onClick} className={classNames(styles.root, props.className)} type='button'>
      <ArrowDownSvg className={styles.arrow}/>
    </Button>
  )
}

BackBtn.defaultProps = {
  size: 'medium'
}

