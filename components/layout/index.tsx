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
      <Sticky>
        {({style, distanceFromTop}) => <div className={styles.headerWrapper}  style={style}>
          <Header distanceFromTop={distanceFromTop}  />
          </div>}
      </Sticky>
      <NavBar/>
      <div className='contentWrapper'>
        {props.children}
      </div>
    </StickyContainer>
  </div>

  )
}