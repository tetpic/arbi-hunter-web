import classnames from 'classnames'
import { NavSet, VCNaviagation } from '../VcResponses'
import styles from './index.module.scss'

interface Props<T> {
  items: NavSet[]
  onClick: (t: VCNaviagation) => void
  active: T
  className?: string
}

export default function ResponsesNavigation<T extends string>(props: Props<T>) {

  return (<div className={classnames(styles.root, props.className)}> 
  {props.items.map((el, index)=>{
    return <p key={index} className={classnames(styles.item, props.active===el.type&&styles.item_active)} onClick={()=>props.onClick(el.type)}>{el.name} <span className={styles.stat}>{el.count}</span></p>
  })}
  </div>)
}