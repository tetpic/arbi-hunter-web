import styles from './index.module.scss'
import Image from 'next/image'
import employeeImage from '../../../images/empoyeeReg.webp'
import { ProfileType } from 'data/interfaces/IRegistration'
import BigHomeSvg from 'components/svg/BigHomeSvg'
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
      ? <Image className={styles.empImage} src={employeeImage} alt={'employeeImage'} width={550} height={527}/>
      : <BigHomeSvg className={styles.svg}/>
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