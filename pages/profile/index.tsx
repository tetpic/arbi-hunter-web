import Profile from 'components/for_pages/profile'
import { useUserContext } from 'context/user_state'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface Props {
}

export default function ProfilePage() {
  const {currentProfile} = useUserContext()
  const router = useRouter()

  useEffect(()=>{
    if(!currentProfile) {
      router.replace('/')
    }
  }, [])

  const searchParams = useSearchParams()

  return (<>
    {currentProfile &&
      <Profile page={searchParams.get('page')}/>
    }
  </>
  )
}