import 'normalize.css'
import 'styles/globals.scss'
import type {AppProps as NextAppProps} from 'next/app'
import App, {AppContext} from 'next/app'
import { useEffect, useState} from 'react'
import {getSelectorsByUserAgent} from 'react-device-detect'
import 'swiper/css/bundle'
import Head from 'next/head'
import 'swiper/css'
import {CookiesProvider} from 'react-cookie'
import { AppTheme, CookiesType } from 'types/enums'
import Layout from 'components/layout'
import { AppWrapper } from 'context/state'
import Snackbar from 'components/layout/Snackbar'
import { UserWrapper } from 'context/user_state'
import BottomSheetContainer from 'components/layout/BottomSheetContainer'
import { AuthWrapper } from 'context/auth_state'
import UserRepository from 'data/repositories/UserRepository'
import { IUser } from 'data/interfaces/IUser'
import { ManagerWrapper } from 'context/manager_state'
// import { VacancyWrapper } from 'context/vacancy_state'
import { PatternWrapper } from 'context/pattern_state'
import { FeedbacksWrapper } from 'context/feedbacks_state'
import { CvWrapper } from 'context/cv_state'
import ModalContainer from 'components/layout/ModalContainer'
import { ProfileType } from 'data/interfaces/IRegistration'
import Router from 'next/router'

export interface AppProps extends NextAppProps {
  pageProps: {
    isMobile: boolean
    token: string
    region: string
    user?: IUser
    profileType?: ProfileType
    webViewOnly?: boolean
    theme?: AppTheme
  }
}

function MyApp({Component, pageProps}: AppProps) {
  const [clientVisible, setClientVisible] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
      setClientVisible(true)
      if (pageProps.isMobile) {
        document.body.classList.add('mobile-ua')
        document.documentElement.className = 'mobile-ua'
      }
    },
  [])

  useEffect(()=>{
    Router.events.on('routeChangeStart', ()=> {
      setLoading(true)
    })
    Router.events.on('routeChangeComplete', ()=> {
      setLoading(false)
    })  
  }, [])

  return (
    <CookiesProvider cookies={(Component as any).universalCookies}>
      <AppWrapper isMobile={pageProps.isMobile} theme={pageProps.theme}>
        <UserWrapper token={pageProps.token} profileType={pageProps.profileType} user={pageProps.user}>
          <ManagerWrapper>
          {/* <VacancyWrapper> */}
          <CvWrapper>
          <PatternWrapper>
          <FeedbacksWrapper>
          <AuthWrapper>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover"
                />
            </Head>
              {/* {loading &&
                <Spinner className='mainSpinner' size={32}/>        
              } */}
            <Layout webView={pageProps.webViewOnly}> 
              <Component {...pageProps} />
            </Layout>
            {clientVisible && <BottomSheetContainer/>}
            {clientVisible && <ModalContainer/>}
            {clientVisible && <Snackbar/>}
            
          </AuthWrapper>
          </FeedbacksWrapper>
          </PatternWrapper>
          </CvWrapper>
          {/* </VacancyWrapper> */}
          </ManagerWrapper>
        </UserWrapper>
      </AppWrapper>
    </CookiesProvider>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const props = await App.getInitialProps(appContext)
  const ua = appContext.ctx.req ? appContext.ctx.req?.headers['user-agent'] : navigator.userAgent
  if (ua) {
    const {isMobile, isTablet} = getSelectorsByUserAgent(ua)
    const data = getSelectorsByUserAgent(ua)
    if (isTablet && typeof window !== 'undefined' && window.screen.width >= 992) {

      props.pageProps.isMobile = false
    } else {
      props.pageProps.isMobile = isMobile
    }

  } else {
    props.pageProps.isMobile = false
  }

  props.pageProps.webViewOnly = appContext.ctx.query.webViewOnly
  props.pageProps.region = appContext.ctx.query.region
  
  if (appContext.ctx.req) {
    if ((appContext.ctx?.req as any).cookies) {
      props.pageProps.theme = (appContext.ctx as any).req.cookies[CookiesType.theme]
      props.pageProps.token = (appContext.ctx as any).req.cookies[CookiesType.accessToken]
      props.pageProps.profileType = (appContext.ctx as any).req.cookies[CookiesType.profileType]
      if(props.pageProps.token) {
        props.pageProps.user = await UserRepository.getCurrentUser(props.pageProps.token).catch(err => {
          return null
        })      
      }
    }
  }

  return props
}

export default MyApp
