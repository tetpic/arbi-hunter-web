import Link from 'next/link'
import styles from './index.module.scss'

import classNames from 'classnames'
import P from '../P'
import { useAppContext } from 'context/state'

interface Props {
  onClick?: (e:React.MouseEvent<HTMLParagraphElement, MouseEvent>)=>void
  link?: string
  text: string
  className?: string
  isActive?: boolean
}


/**
 * @onClick ? ()=>void
 * @link ?: string
 * @text string
 * @className ?: string
 * @isActive ?: boolean
 */
export default function Tag(props: Props) {
  const {theme} = useAppContext()

  if(props.link) {
    return (
      <Link href={props.link} data-cy={'tag_'+props.text} className={classNames(styles.tag, props.className, props.isActive&&styles.isActive)}>{props.text}</Link>
    )
  }

  return (
    <P styleType={['medium', 'w500']}  useThemeColor title={props.text} data-cy={'tag_'+props.text} className={classNames(styles.tag, styles[theme], props.className, props.isActive&&styles.isActive)} onClick={props.onClick}>{props.text}</P>
  )
}