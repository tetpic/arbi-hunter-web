import Profile from 'components/for_pages/profile'
import { useUserContext } from 'context/user_state'
import Head from 'next/head'
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
    <Head>
      <title>{'Arbi Hunter|Личный кабинет'}</title>
      <meta name='description' content={'Личный кабинет'}/>
    </Head>
    {currentProfile &&
      <Profile page={searchParams.get('page')}/>
    }
  </>
  )
}