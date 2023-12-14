import styles from './index.module.scss'
// import Image from 'next/image'
// import employeeImage from '../../../images/employeeReg.webp'
// import hirerImage from '../../../images/house.webp'
import { ProfileType } from 'data/interfaces/IRegistration'
import classNames from 'classnames'
import { useUserContext } from 'context/user_state'
import Rive from '@rive-app/react-canvas'
// import { useMemo } from 'react'

interface Props {
  type: ProfileType,
  className?: string
}

export default function UserRegImage(props: Props) {

  const userContext = useUserContext()

  // const memoedRive = useMemo(()=>{
  //   const src = userContext.profileType===ProfileType.Hirer?'/rive/login/company.riv':'/rive/login/user.riv'
  //   return <Rive src={src} key={src} className={styles.regImage}/>
  // }, [userContext.currentProfile])

  const emptyImages = (<>
    {props.type === ProfileType.Employee
    ? <Rive src={'/rive/login/user.riv'} key={1} className={styles.regImage}/>
    : <Rive src={'/rive/login/company.riv'} key={2} className={styles.regImage}/>
      // ? <Image className={styles.empImage} src={employeeImage} alt={'employeeImage'} width={566} height={527}/>
      // : <Image className={styles.empImage} src={hirerImage} alt={'employeeImage'} width={566} height={527}/>
    
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