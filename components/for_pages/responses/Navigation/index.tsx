import classnames from 'classnames'
import styles from './index.module.scss'

interface Props<T> {
  items: {name: string, type: T, counter?: number}[]
  onClick: (t: T) => void
  active: T
  className: string
}

export default function ResponsesNavigation<T extends string>(props: Props<T>) {

  return (<div className={classnames(styles.root, props.className)}> 
  {props.items.map(el=>{
    return <p className={classnames(styles.item, props.active===el.type&&styles.item_active)} onClick={()=>props.onClick(el.type)}>{el.name} <span className={styles.stat}>0</span></p>
  })}

  </div>)
}