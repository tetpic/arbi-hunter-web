import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import CVResponses from './CvResponses'
import VCResponses from './VcResponses'

interface Props {
  id: number
}

export default function Responses(props: Props) {
  const userContext = useUserContext()
  

  return (<>
  { 
    userContext.currentProfile.profileType === ProfileType.Hirer && 
    <VCResponses id ={props.id}/>
    ||
    userContext.currentProfile.profileType === ProfileType.Employee &&
    <CVResponses/>  
  }
  </>
  )
}