import styles from './index.module.scss'

interface Props {
  items: {
    title: string
    value: string
    icon?: JSX.Element
  }[]
}


/**
 * @items {
    title: string
    value: string
    icon: JSX.Element
  }[]
 * 
 *  
 */
export default function Badges(props: Props) {

  return (<div className={styles.root}>
    {props.items.map((el, index)=>{
      return (
        <>
          <div className={styles.badge} key={index+el.value} >
            {el.icon &&
            <div className={styles.badgeIcon}>
              {el.icon}
            </div>
            }
            <p className={styles.badgeText}>
              {el.title}
            </p>
            <p className={styles.badgeValue}>
              {el.value}
            </p>
          </div>
          <div className={styles.separator}  key={index}></div>
        </>
      )
    })}  
  </div>)
}