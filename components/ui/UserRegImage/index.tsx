import styles from './index.module.scss'
import Image from 'next/image'
import employeeImage from '../../../images/employeeReg.webp'
import hirerImage from '../../../images/house.webp'
import { ProfileType } from 'data/interfaces/IRegistration'
import classNames from 'classnames'
import { useUserContext } from 'context/user_state'

interface Props {
  type: ProfileType,
  className?: string
}

export default function UserRegImage(props: Props) {

  const userContext = useUserContext()

  const emptyImages = (<>
    {props.type === ProfileType.Employee
      ? <Image className={styles.empImage} src={employeeImage} alt={'employeeImage'} width={566} height={527}/>
      : <Image className={styles.empImage} src={hirerImage} alt={'employeeImage'} width={566} height={527}/>
    
    }
  </>)

  // const fullImages = (<>
  // </>)

  return ( 
    <div className={classNames(styles.root, props.className)}>
      {emptyImages}  
      
    </div>
  )
}