import MediaPage from 'components/for_pages/media/MediaPage'
import Head from 'next/head'

interface Props {
}

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