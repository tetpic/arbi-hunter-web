import classNames from 'classnames'
import styles from './index.module.scss'

interface Props {
  onClick?: ()=>void
  text: string
  className?: string
}


/**
 * @onClick ? ()=>void
 * @text string
 */
export default function Tag(props: Props) {

  return (
    <p className={classNames(styles.tag, props.className)} onClick={props.onClick}>{props.text}</p>
  )
}