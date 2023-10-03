import Vacancy from 'components/for_pages/create/Vacancy'
import { CreateVcCvWrapper } from 'context/createVcCv_state'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import Head from 'next/head'
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
    return  (<>
      <Head>
        <title>{'Arbi Hunter|Редактирование Вакансии'}</title>
        <meta name='description' content={'Редактирование Вакансии'}/>
      </Head>
      <CreateVcCvWrapper>
        <Vacancy id={Number(router.query.id) as number}/>
      </CreateVcCvWrapper>
    </>)
  } 
  return null

}