import classNames from 'classnames'
import styles from './index.module.scss'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { useAppContext } from 'context/state'

export type ParagraphStyleType = 
'small'|'medium'|'large'|'huge'|
'w500'|'w600'|'w700'|'w800'|
'fs32'|'fs36'|'fs20'|
'white'|'grey'|'greyLight'|'blue'|'purple'|
'underlined'|'green'|'red'|
'alignEnd'|'alignCenter'|'alignStart'|'textCenter'

interface Props extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>, 'className'|'styleType'>{
  styleType?: ParagraphStyleType[]
  altStyleType?: ParagraphStyleType[]
  children?: any
  className?: string
  useThemeColor?: boolean
}

export default function P(props: Props) {
  const {styleType, className, ...rest} = props
  const {theme} = useAppContext()

  return (
    <p {...rest} className={classNames(styleType?.map(el=> styles[el]), styles.p, props.useThemeColor&&styles.themeColor, className)} >
      {props.children}
    </p>
  )
}