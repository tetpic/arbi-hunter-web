import styles from './index.module.scss'

import classNames from 'classnames'

interface Props {
  children: JSX.Element|JSX.Element[]
  className?: string
}

export default function ContentItem(props: Props) {

  return (<div className={classNames(styles.root, props.className)}> 
  {props.children}
  </div>)
}