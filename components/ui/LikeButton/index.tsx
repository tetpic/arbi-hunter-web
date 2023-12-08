import styles from './index.module.scss'

import HeartSvg from 'components/svg/HeartSvg'
import classNames from 'classnames'
import Button from '../Button'
import { useState } from 'react'

interface Props {
  className: string
  active?: boolean
  onClick: ()=> void
}

export default function LikeButton(props: Props) {
  const [active, setActive] = useState<boolean>(props.active)
  const onClickHandler = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    props.onClick()
    setActive(!active)
  }
  return (<Button onClick={(e)=> onClickHandler(e)} className={classNames(styles.heart, props.className, active&&styles.heart_active )}><HeartSvg/></Button>)
}