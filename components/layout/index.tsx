import { ReactElement } from 'react'
import Header from './Header'
import styles from './index.module.scss'
import NavBar from './NavBar'

interface Props {
  children: ReactElement
}

export default function Layout(props: Props) {

  return ( 
  <div className={styles.root}>
    <Header/>
    <NavBar/>
    <div className='contentWrapper'>
      {props.children}
    </div>
  </div>

  )
}