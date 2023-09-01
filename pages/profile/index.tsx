import Profile from 'components/for_pages/profile'
import { useUserContext } from 'context/user_state'
import { useSearchParams } from 'next/navigation'

interface Props {
}

//todo: сделать доступ с проверкой isAuth

export default function ProfilePage() {


  const {currentProfile} = useUserContext()
  const searchParams = useSearchParams()

  return (<>
    {currentProfile &&
      <Profile page={searchParams.get('page')}/>
    }
  </>
  )
}