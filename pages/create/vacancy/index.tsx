import Vacancy from 'components/for_pages/create/Vacancy'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

interface Props {
}
//todo: сделать доступ с проверкой isAuth
export default function VacancyCreate(props: Props) {
  const userContext = useUserContext()
  const router = useRouter()

  useEffect(()=>{
    if(!userContext.currentProfile || userContext.currentProfile.profileType !== ProfileType.Hirer) {
      router.push('/')
    }
  }, [userContext.isLogged, userContext.userLoaded])

  if(userContext.currentProfile?.profileType === ProfileType.Hirer) {
    return  <Vacancy id={Number(router.query.id) as number}/>
  } 
  return null

}