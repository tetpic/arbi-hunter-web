import classnames from 'classnames'
import styles from './index.module.scss'

interface Props {
  children: JSX.Element|JSX.Element[]
  className?: string
}

export default function ContentAside(props: Props) {

  return (<div className={classnames(styles.root, props.className)}> 
    {props.children}
  </div>)
}