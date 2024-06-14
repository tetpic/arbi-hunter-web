import {CookiesType} from 'types/enums'
import {CookiesLifeTime} from 'types/constants'
import {setCookie} from 'nookies'


export default function ImpersonatePage() {
  return <></>
}
export const getServerSideProps = async (context: any) => {
  const token = context.query.token as string
  const redirect = context.query.redirect as string
  try {
    setCookie(context, CookiesType.accessToken, token, {
      maxAge: CookiesLifeTime.accessToken,
      path: '/'
    })
    return {
      props: {},
      redirect: {
        destination: redirect ?? '/',
        permanent: false,
      },
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return {
      props: {},
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

}
