import Cv from 'components/for_pages/create/Cv'
import { useUserContext } from 'context/user_state'
import { useRouter } from 'next/router'

interface Props {
}
//todo: сделать доступ с проверкой isAuth
export default function CvCreate(props: Props) {
  const userContext = useUserContext()
  const router = useRouter()

  return (
    <>{userContext.isLogged && userContext.userLoaded &&
      <Cv id={Number(router.query.id) as number}/>
    }</>
  )
}