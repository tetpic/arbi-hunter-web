import MediaPage from 'components/for_pages/media/MediaPage'
import Head from 'next/head'
import { CookiesType } from 'types/enums'

interface Props {
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  if(!profileType || !token) {
    return {
      redirect: {destination: '/login', permanent: false}   
    }
  }
  else {
    return {props: {}}
  }
}) 

export default function Media(props: Props) {

  return (<>
  <Head>
    <title>{'Arbi Hunter|Медиа'}</title>
    <meta name='description' content={'Медиа'}/>
  </Head>
  <MediaPage/>
  </>
  )
}