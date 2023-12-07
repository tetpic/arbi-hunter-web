import classNames from 'classnames'
import styles from './index.module.scss'

interface Props {
  children: JSX.Element|JSX.Element[]
  className?: string  
}


/**
 * Needs to provide ContentBody & ContentAside
 * @children JSX.Element|JSX.Element[]
 */
export default function Content(props: Props) {

  return (<div className={classNames(styles.root, props.className)}> 
    {props.children}
  </div>)
}