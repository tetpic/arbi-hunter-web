import styles from './index.module.scss'
import classNames from 'classnames'

interface Props {
  title: string
  emoji?: JSX.Element
  className?: string
}

export default function Title(props: Props) {
  return (
    <div className={classNames(styles.root, props.className)}>
      {props.title} {props.emoji}
    </div>
  )
}

