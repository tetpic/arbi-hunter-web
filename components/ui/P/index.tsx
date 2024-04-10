import classNames from 'classnames'
import styles from './index.module.scss'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'

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
  getRef?: (r: HTMLParagraphElement) => void
}

export default function P(props: Props) {
  const {styleType, className, altStyleType, getRef, ...rest} = props

  const {theme} = useAppContext()

  return (
    <p {...rest} ref={r=>getRef?.(r)} className={
      classNames(
        theme===AppTheme.Light&&altStyleType
        ?altStyleType.map(el=> styles[el])
        :styleType?.map(el=> styles[el]), 
        styles.p, 
        props.useThemeColor&&styles.themeColor, 
        className
        )} >
      {props.children}
    </p>
  )
}