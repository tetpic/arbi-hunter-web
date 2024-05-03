import P from '../P'
import styles from './index.module.scss'
import classNames from 'classnames'

interface Props {
  items: {name: string, count:string|number|null}[]
  title: string
  className?: string 
}

export default function Statistics(props: Props) {



  return (<div className={classNames(styles.stats, props.className) }>
    <P styleType={['medium', 'w500']} useThemeColor>{props.title}</P>
    <div className={styles.items}>
      {props.items&&props.items.length>0&&
        props.items.map((el, index)=>{
          return (
            <div className={styles.stats_item} key={index}>
              <p className={styles.stats_desc}>{el.name}</p>
              <P styleType={['large', 'w600']} useThemeColor className={styles.stats_count}>{el.count||'0'}</P>
            </div>
          )
        })
      }
    </div>
  </div>)
}