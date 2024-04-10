import classNames from 'classnames'
import styles from './index.module.scss'
import P from '@/components/ui/P'

interface Props {
  text: string|JSX.Element|JSX.Element[]
  title?: string
  onClick?: () => void
  className?: string
}

export default function SectionSubtitle(props: Props) {
  return (<P title={props.title} styleType={['w600', 'large', 'alignCenter']} useThemeColor className={classNames(styles.subtitle, props.className)} onClick={props.onClick}>{props.text}</P>)
}