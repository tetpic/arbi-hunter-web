import classNames from 'classnames'
import styles from './index.module.scss'
import {ReactElement} from 'react'


interface Props {
 static?: boolean
 children: string | ReactElement | ReactElement[]
 className?: string
}

export default function FieldLabel(props: Props) {

  return (
    <div className={classNames(styles.label, props.className)}>
      {props.children}
    </div>
  )
}

