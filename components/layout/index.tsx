import { ReactElement } from 'react'
import Header from './Header'
import styles from './index.module.scss'
import NavBar from './NavBar'
import { Sticky, StickyContainer } from 'react-sticky'
import { useUserContext } from 'context/user_state'

interface Props {
  children: ReactElement
}

export default function Layout(props: Props) {
  const userContext = useUserContext()

  return ( 
  <div className={styles.root}>
    <StickyContainer>
      <Sticky>
        {({style, distanceFromTop}) => <div className={styles.headerWrapper}  style={style}>
          <Header distanceFromTop={distanceFromTop}  />
          </div>}
      </Sticky>
      {userContext.isLogged &&
        <NavBar/>
      }
      {props.children}
    </StickyContainer>
  </div>

  )
}