import { useUserContext } from 'context/user_state';
import ApplicationRepository from 'data/repositories/ApplicationRepository';
import { useRouter } from 'next/router'
import { useEffect } from 'react';


interface Props {
}

export default function ResponceItem(props: Props) {
  const router = useRouter()

  const { id } = router.query;

  const userContext = useUserContext()

  useEffect(()=>{
    ApplicationRepository.getVacancyApplication(id.toString(), userContext.currentProfile.profileType)
    .then(res=> {
      debugger
    })
  
  }, [])

  

  return (<div > 
  {id}

  </div>)
}