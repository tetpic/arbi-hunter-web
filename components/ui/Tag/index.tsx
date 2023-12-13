import styles from './index.module.scss'

import classNames from 'classnames'

interface Props {
  onClick?: (e:React.MouseEvent<HTMLParagraphElement, MouseEvent>)=>void
  text: string
  className?: string
  isActive?: boolean
}


/**
 * @onClick ? ()=>void
 * @text string
 */
export default function Tag(props: Props) {

  return (
    <p className={classNames(styles.tag, props.className, props.isActive&&styles.isActive)} onClick={props.onClick}>{props.text}</p>
  )
}