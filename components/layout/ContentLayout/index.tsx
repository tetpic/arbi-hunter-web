import styles from './index.module.scss'

import Head from 'next/head'
import Footer from '../Footer'
import { useAppContext } from 'context/state'
import { useResize } from 'components/hooks/useResize'
import { useEffect } from 'react'
import { useUserContext } from 'context/user_state'
import classnames from 'classnames'
import MobileBottomMenu from '@/components/ui/MobileBottomMenu'

interface Props {
  title?: string,
  description?: string 
  children: JSX.Element|JSX.Element[]
  withFooter?: boolean
  disabledNavBar?: boolean
  hideMobileHeader?: boolean
  withMobileMenu?: boolean
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
  const {isTabletWidth} = useResize()

  useEffect(()=>{
    if(isTabletWidth&&props.hideMobileHeader) {
      appContext.setHideHeader(true)
    }
    else {
      return (()=> {
        appContext.setHideHeader(false)
      })
    }
  
  }, [isTabletWidth])

  return (
  <>
    {
      props.title &&
      <Head>
        <title>{`Arbi Hunter|${props.title}`}</title>
        <meta name='description' content={props.description||props.title}/>
      </Head>
    }
    <div className={styles.wrapper}>
      <div className={classnames(props.disabledNavBar && styles.disabledNavBar,  'contentWrapper')}> 
        {props.children}
      </div>
      {props.withFooter &&
        <Footer/>
      }
      {props.withMobileMenu && isTabletWidth &&
        <MobileBottomMenu/>
      }
    </div>
  </>
  )
}