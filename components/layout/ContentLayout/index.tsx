import styles from './index.module.scss'

import Head from 'next/head'
import Footer from '../Footer'
import { useAppContext } from 'context/state'
import { useResize } from 'components/hooks/useResize'
import { useEffect } from 'react'
import { useUserContext } from 'context/user_state'
import classnames from 'classnames'
import MobileBottomMenu from '@/components/ui/MobileBottomMenu'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

interface Props {
  title?: string,
  description?: string 
  children: JSX.Element|JSX.Element[]
  withFooter?: boolean
  disabledNavBar?: boolean
  hideMobileHeader?: boolean
  withMobileMenu?: boolean
  isMobile?: boolean
}

/**
 * @title string
 * @description string 
 * @children JSX.Element|JSX.Element[]
 * @withFooter boolean
 * @hideMobileHeader boolean
 */
export default function ContentLayout(props: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const isLogged = userContext.isLogged
  const {isTabletWidth} = useResize()

  useEffect(()=>{
    if((isTabletWidth||props.isMobile)&&props.hideMobileHeader) {
      appContext.setHideHeader(true)
    }
    else {
      appContext.setHideHeader(false)
    }
  
  }, [isTabletWidth, props.isMobile])

  return (
  <>
    {
      props.title &&
      <Head>
        <title>{`ArbiHunter | ${props.title}`}</title>
        <meta name='description' content={props.description||props.title}/>
      </Head>
    }
    <div className={classnames(styles.wrapper, props.withMobileMenu && isTabletWidth && styles.withMobileMenu, !props.withFooter && styles.withoutFooter)}>
      <div className={classnames(props.disabledNavBar && styles.disabledNavBar,  'contentWrapper')}> 
      <ErrorBoundary>
        {props.children}
      </ErrorBoundary>
      </div>
      {(isTabletWidth?!isLogged && props.withFooter:props.withFooter ) &&
        <Footer/>
      }
      {props.withMobileMenu && isTabletWidth &&
        <MobileBottomMenu/>
      }
    </div>
  </>
  )
}