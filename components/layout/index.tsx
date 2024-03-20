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
  const {isTabletWidth} = appContext.size

  return ( 
  <div className={styles.root} data-theme={appContext.theme} id={'mainLayout'}>
    <StickyContainer>
      {!appContext.hideHeader &&
      <Sticky>
        {({style, distanceFromTop}) => <div className={styles.headerWrapper}  style={style}>
          <Header distanceFromTop={distanceFromTop}  />
        </div>}
      </Sticky>
      }
      <div className={styles.content}>
      {userContext.isLogged && !isTabletWidth &&
        <NavBar/>
      }
      {props.children}
      </div>
    </StickyContainer>
  </div>

  )
}