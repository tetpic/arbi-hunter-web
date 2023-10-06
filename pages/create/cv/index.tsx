import Cv from 'components/for_pages/create/Cv'
import { useUserContext } from 'context/user_state'
import Head from 'next/head'
import { useRouter } from 'next/router'

interface Props {
}
//todo: сделать доступ с проверкой isAuth
export default function CvCreate(props: Props) {
  const userContext = useUserContext()
  const router = useRouter()

  return (
    <>
    <Head>
      <title>{'Arbi Hunter|Редактирование Резюме'}</title>
      <meta name='description' content={'Редактирование Резюме'}/>
    </Head>
    {userContext.isLogged && userContext.userLoaded &&
      <Cv id={Number(router.query.id) as number}/>
    }</>
  )
}