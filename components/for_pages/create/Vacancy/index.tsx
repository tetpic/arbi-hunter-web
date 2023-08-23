import UserRegImage from 'components/ui/UserRegImage'
import { ProfileType } from 'data/interfaces/IRegistration'
import styles from './index.module.scss'

interface Props {
}

export default function Vacancy(props: Props) {

  return ( 
    <div className='contentWrapper'>
      <UserRegImage type={ProfileType.Hirer}/>
      
      <>создание вакансии</>
    </div>

  )
}