import Registration from 'components/for_pages/registration'
import { useUserContext } from 'context/user_state'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styles from './index.module.scss'

interface Props {
}

export default function RegistrationPage(props: Props) {

  const userContext = useUserContext()
  const router = useRouter()

  useEffect(()=>{
    if(userContext.isLogged && userContext.currentProfile) {
      router.back()
    }
  }, [])

 

  return ( 
    <Registration/>
  )
}