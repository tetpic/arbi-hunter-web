import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import CVFeedbacks from './CvResponses'
import VCFeedbacks from './VcResponses'
import { VacancyWrapper } from 'context/vacancy_state'

interface Props {
  id?: number
}

export default function Responses(props: Props) {
  const userContext = useUserContext()
  

  return (<>
  { 
    userContext.currentProfile?.profileType === ProfileType.Hirer && 
    <VacancyWrapper>
      <VCFeedbacks id ={props.id}/>
    </VacancyWrapper>
    ||
    userContext.currentProfile?.profileType === ProfileType.Employee &&
    <CVFeedbacks/>  
  }
  </>
  )
}