import styles from './index.module.scss'

import { ReactElement, useEffect } from 'react'
import Header from './Header'
import NavBar from './NavBar'
import { Sticky, StickyContainer } from 'react-sticky'
import { useUserContext } from 'context/user_state'
import { useAppContext } from 'context/state'
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar'


interface Props {
  children: ReactElement
  authorized?: boolean
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

      {(!appContext.hideHeader ?? !props.webView) && (!isTabletWidth||!userContext.isLogged) &&
      <Sticky>
        {({style, distanceFromTop}) => <div className={styles.headerWrapper}  style={style}>
          <Header distanceFromTop={distanceFromTop} authorized={props.authorized} />
        </div>}
      </Sticky>
      ||
      (!appContext.hideHeader ?? !props.webView) && isTabletWidth && 
      <Header distanceFromTop={0} authorized={props.authorized}/>
      }
      <div className={styles.content}>
      {userContext.isLogged && !isTabletWidth && !props.webView && 
        <NavBar/>
      }
      {props.children}
      </div>
    </StickyContainer>
    <ProgressBar
    options={{ showSpinner: false}}
    height='2px'
    shallowRouting
    color='#8e6cdf'
    />

  </div>

  )
}