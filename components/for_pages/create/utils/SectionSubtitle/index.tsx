import classNames from 'classnames'
import styles from './index.module.scss'

interface Props {
  text: string|JSX.Element|JSX.Element[]
  title?: string
  onClick?: () => void
  className?: string
}

export default function SectionSubtitle(props: Props) {
  return (<p title={props.title} className={classNames(styles.subtitle, props.className)} onClick={props.onClick}>{props.text}</p>)
}