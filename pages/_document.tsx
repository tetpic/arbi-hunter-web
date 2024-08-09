//@ts-nocheck
import Document, {Html, Head, Main, NextScript, DocumentContext} from 'next/document'
import { Cookies } from 'react-cookie'
import { colors } from 'styles/variables'
import { AppTheme } from 'types/enums'
import Script from 'next/script'

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
    //@ts-nocheck
    const theme: AppTheme = this.props.__NEXT_DATA__.props.pageProps.theme
    return (
      <Html style={{width: '100vw', backgroundColor: theme === AppTheme.Light?'#F5F2F7':'#16161B'}}>
        <Head >
          <link rel="apple-touch-icon" sizes="152x152" href="/arbihunter152.png"/>
          <link rel="apple-touch-icon" sizes="76x76" href="/arbihunter76.png"/>
          <link rel="apple-touch-icon" sizes="120x120" href="/arbihunter120.png"/>
          <link rel="icon" href="/arbiFavicon48.svg"/>
          <link rel="manifest" href="/site.webmanifest"/>
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#812292"/>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" /> 
          <meta name="msapplication-TileColor" content="#da532c"/>
          <meta name="msapplication-navbutton-color" content={colors.backgroundBlack} />
          <meta name="theme-color" content={colors.backgroundBlack}/>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
          <Script id={'google-tag-manager'} strategy="afterInteractive">
            {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MQCJP7JF');
              console.log('gtm works')

            `}
          </Script>
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MQCJP7JF"
          height="0" width="0" style={{display:'none', visibility:'hidden'}}></iframe></noscript>

          <Script id={'yandex-metrika'} strategy="afterInteractive">
            {`  
             (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
             m[i].l=1*new Date();
             for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
             k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
             (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
             
             console.log('metrika works')

               ym(97434160, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true});
            `}
          </Script>
          <noscript><div><img src="https://mc.yandex.ru/watch/97434160" style={{position: 'absolute', left: '-9999px'}} alt="" /></div></noscript>
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
