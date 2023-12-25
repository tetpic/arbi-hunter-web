import classnames from 'classnames'
import styles from './index.module.scss'

interface Props {
  children: JSX.Element|JSX.Element[]
  className?: string
  hide?: boolean
}

export default function ContentAside(props: Props) {

  if(props.hide) {
    return null
  }

  return (<div className={classnames(styles.root, props.className)}> 
    {props.children}
  </div>)
}