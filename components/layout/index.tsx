import styles from './index.module.scss'

import { ReactElement, useEffect } from 'react'
import Header from './Header'
import NavBar from './NavBar'
import { Sticky, StickyContainer } from 'react-sticky'
import { useUserContext } from 'context/user_state'
import { useAppContext } from 'context/state'

interface Props {
  children: ReactElement
  webView?: boolean
}

export default function Layout(props: Props) {
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  useEffect(()=>{
    document.body.dataset.theme = appContext.theme
  }, [appContext.theme])

  return ( 
  <div className={styles.root}  id={'mainLayout'}>
    <StickyContainer>
      {(!appContext.hideHeader ?? !props.webView) &&
      <Sticky>
        {({style, distanceFromTop}) => <div className={styles.headerWrapper}  style={style}>
          <Header distanceFromTop={distanceFromTop}  />
        </div>}
      </Sticky>
      }
      <div className={styles.content}>
      {userContext.isLogged && !isTabletWidth && !props.webView &&
        <NavBar/>
      }
      {props.children}
      </div>
    </StickyContainer>
  </div>

  )
}