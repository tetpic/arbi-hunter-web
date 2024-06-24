import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import CVFeedbacks from './CvResponses'
import VCFeedbacks from './VcResponses'
import { VacancyWrapper } from 'context/vacancy_state'
import { FavoritesFolderWrapper } from 'context/favorites_folder_state'
import { FeedbacksWrapper } from 'context/feedbacks_state'

interface Props {
  id?: number
}

export default function Responses(props: Props) {
  const userContext = useUserContext()
  

  return (<>
  <FeedbacksWrapper>
  { 
    userContext.currentProfile?.profileType === ProfileType.Hirer && 

    <VacancyWrapper>
      <FeedbacksWrapper>
      <FavoritesFolderWrapper>
      <VCFeedbacks id ={props.id}/>
      </FavoritesFolderWrapper>
      </FeedbacksWrapper>
    </VacancyWrapper>
    ||
    userContext.currentProfile?.profileType === ProfileType.Employee &&
    <CVFeedbacks/>  
  }
   </FeedbacksWrapper>
  </>
  )
}