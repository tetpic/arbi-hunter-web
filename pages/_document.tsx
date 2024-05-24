import Document, {Html, Head, Main, NextScript, DocumentContext} from 'next/document'
import { Cookies } from 'react-cookie'
import { colors } from 'styles/variables'
import { AppTheme } from 'types/enums'
class MyDocument extends Document {
  static async getStaticProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceComponent: Component => {
          (Component as any).universalCookies = new Cookies(ctx.req.headers.cookie)
          return Component
        },
      })

    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }
  
  render() {
    //@ts-ignore
    const theme: AppTheme = this.props.__NEXT_DATA__.props.pageProps.theme
    return (
      <Html style={{height: '100vh', width: '100vw', backgroundColor: theme === AppTheme.Light?'#F5F2F7':'#16161B'}}>
        <Head >
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.svg"/>
          {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/> */}
          <link rel="manifest" href="/site.webmanifest"/>
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#812292"/>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" />       
          <meta name="msapplication-TileColor" content="#da532c"/>
          <meta name="msapplication-navbutton-color" content={colors.backgroundBlack} />
          <meta name="theme-color" content={colors.backgroundBlack}/>
        </Head>


        <body data-theme='dark' id='body' >
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
