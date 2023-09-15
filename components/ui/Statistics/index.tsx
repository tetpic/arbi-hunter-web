import classNames from 'classnames'
import styles from './index.module.scss'

interface Props {
  items: {name: string, count:string|number|null}[]
  title: string
  className?: string 
}

export default function Statistics(props: Props) {

  return (<div className={classNames(styles.stats, props.className) }>
    <p className={styles.stats_title}>{props.title}</p>
    {props.items&&props.items.length>0&&
      props.items.map(el=>{
        return (
          <div className={styles.stats_item}>
            <p className={styles.stats_desc}>{el.name}</p>
            <p className={styles.stats_count}>{el.count||'0'}</p>
          </div>
        )
      })
    }
  </div>)
}