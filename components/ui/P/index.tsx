import classNames from 'classnames'
import styles from './index.module.scss'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

export type ParagraphStyleType = 'small'|'medium'|'large'|'huge'|'w500'|'w600'|'w700'|'fs32'|'f36'|'f20'|'white'|'grey'|'greyLight'|'blue'|'underlined'|'green'|'red'|'alignEnd'

interface Props extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>, 'className'|'styleType'>{
  styleType?: ParagraphStyleType[]
  children?: any
  className?: string
}

export default function P(props: Props) {
  const {styleType, className, ...rest} = props

  return (
    <p {...rest} className={classNames(styleType?.map(el=> styles[el]), styles.p, className)} >
      {props.children}
    </p>
  )
}