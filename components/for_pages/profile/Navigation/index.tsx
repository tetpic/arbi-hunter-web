import classnames from 'classnames'
import { NavigationSet, ProfilePages } from '..'
import styles from './index.module.scss'

interface Props {
  setPage: (p: ProfilePages) => void
  currentPage: ProfilePages
  navSet?: NavigationSet[]
}

export default function ProfileNavigation(props: Props) {

  return ( 
  <nav className={styles.root}>
    {props.navSet.length > 0&&props.navSet.map((el, index)=> {
      return <p key={index} onClick={()=>props.setPage(el.type)} className={classnames(styles.navItem, el.type === props.currentPage&&styles.navItem_active)}>{el.icon} {el.name}</p>
    })}
  </nav>
  )
}