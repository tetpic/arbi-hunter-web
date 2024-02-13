import classNames from 'classnames'
import styles from './index.module.scss'

export type ParagraphStyleType = 'small'|'medium'|'large'|'huge'|'w500'|'w600'|'w700'|'fs32'|'f36'|'f20'|'white'|'grey'|'greyLight'

interface Props {
  styleType?: ParagraphStyleType[]
  children?: JSX.Element|JSX.Element[]|string[]|string
}

export default function P(props: Props) {

  return (
    <p className={classNames(props.styleType?.map(el=> styles[el]), styles.p)}>
      {props.children}
    </p>
  )
}