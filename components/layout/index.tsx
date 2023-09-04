import { ReactElement } from 'react'
import Header from './Header'
import styles from './index.module.scss'
import NavBar from './NavBar'
import { Sticky, StickyContainer } from 'react-sticky'

interface Props {
  children: ReactElement
}

export default function Layout(props: Props) {

  return ( 
  <div className={styles.root}>
    <StickyContainer>
      <Sticky>{({style}) => <div className={styles.headerWrapper} style={style}><Header/></div>}</Sticky>
      <NavBar/>
      <div className='contentWrapper'>
        {props.children}
      </div>
    </StickyContainer>
  </div>

  )
}