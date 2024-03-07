import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import RecruitingEmployee from '../../recruiting/RecruitingEmployee'
import RecruitingHirer from '../../recruiting/RecruitingHirer'
import { IVacancy } from 'data/interfaces/IVacancy'
import { ICV } from 'data/interfaces/ICV'

interface Props {
  vacancies?: IVacancy[]
  cvs?: ICV[]
}

export default function MainLanding(props: Props) {
  const userContext = useUserContext()


  return ( <>
    {userContext.profileType===ProfileType.Employee &&
      <RecruitingEmployee vacancies={props.vacancies} />
      ||
      <RecruitingHirer cvs={props.cvs}/>
    }
  </>
  )
}