import styles from './index.module.scss'
import { ProfileType } from 'data/interfaces/IRegistration'
import classNames from 'classnames'
import Rive from '@rive-app/react-canvas'

interface Props {
  type: ProfileType,
  className?: string
}

export default function UserRegImage(props: Props) {

  const emptyImages = (<>
    {props.type === ProfileType.Employee
    ? <Rive src={'/rive/login/user.riv'} artboard='EN'  key={1}  className={styles.regImage}/>
    : <Rive src={'/rive/login/company.riv'} artboard='RU'  key={2} className={styles.regImage} />
    }
  </>)

  return ( 
    <div className={classNames(styles.root, props.className)}>
      {emptyImages}  
    </div>
  )
}