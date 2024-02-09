import styles from './index.module.scss'

import { ReactElement } from 'react'
import Header from './Header'
import NavBar from './NavBar'
import { Sticky, StickyContainer } from 'react-sticky'
import { useUserContext } from 'context/user_state'
import { useAppContext } from 'context/state'

interface Props {
  children: ReactElement
}

export default function Layout(props: Props) {
  const userContext = useUserContext()
  const appContext = useAppContext()

  return ( 
  <div className={styles.root}>
    <StickyContainer>
      {!appContext.hideHeader &&
      <Sticky>
        {({style, distanceFromTop}) => <div className={styles.headerWrapper}  style={style}>
          <Header distanceFromTop={distanceFromTop}  />
          </div>}
      </Sticky>
      }
      <div className={styles.content}>
      {userContext.isLogged &&
        <NavBar/>
      }
      {props.children}
      </div>
    </StickyContainer>
  </div>

  )
}