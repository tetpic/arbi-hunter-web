import classNames from 'classnames'
import styles from './index.module.scss'

interface Props {
  children: JSX.Element|JSX.Element[]
  className?: string
}


export default function ContentBody(props: Props) {

  return (<div className={classNames(styles.root, props.className)}> 
    {props.children}
  </div>)
}