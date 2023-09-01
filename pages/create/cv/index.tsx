import Cv from 'components/for_pages/create/Cv'
import { useUserContext } from 'context/user_state'
import styles from './index.module.scss'

interface Props {
}
//todo: сделать доступ с проверкой isAuth
export default function CvCreate(props: Props) {
  const userContext = useUserContext()

  return (
    <>{userContext.isLogged && userContext.userLoaded &&
      <Cv/>
    }</>
  )
}