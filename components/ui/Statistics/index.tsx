import { useRouter } from 'next/router'
import P from '../P'
import styles from './index.module.scss'
import classNames from 'classnames'

interface Props {
  items: {name: string, count:string|number|null, link?: string}[]
  title: string
  className?: string 
}

export default function Statistics(props: Props) {

  const router = useRouter()

  return (<div className={classNames(styles.stats, props.className) }>
    <P styleType={['medium', 'w500']}  useThemeColor>{props.title}</P>
    <div className={styles.items}>
      {props.items&&props.items.length>0&&
        props.items.map((el, index)=>{
          return (
            <div 
            className={classNames(styles.stats_item, el.link && styles.stats_itemLink)} 
            key={index} 
            onClick={(e) => {
              e.stopPropagation()
              el.link && router.push(el.link)}
            } >
              <p className={styles.stats_desc}>{el.name}</p>
              <P styleType={['large', 'w600']} useThemeColor className={styles.stats_count}>{el.count||'0'}</P>
            </div>
          )
        })
      }
    </div>
  </div>)
}