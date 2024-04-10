import styles from './index.module.scss'

import classNames from 'classnames'
import {ReactElement} from 'react'
import { useAppContext } from 'context/state'


interface Props {
 static?: boolean
 children: string | ReactElement | ReactElement[]
 className?: string
}

export default function FieldLabel(props: Props) {
  const {theme} = useAppContext()

  return (
    <div className={classNames(styles.label, props.className, styles[theme])}>
      {props.children}
    </div>
  )
}

