import styles from './index.module.scss'
import Image from 'next/image'
import employeeImage from '../../../images/empoyeeReg.webp'
import { ProfileType } from 'data/interfaces/IRegistration'
import BigHomeSvg from 'components/svg/BigHomeSvg'
import classNames from 'classnames'

interface Props {
  type: ProfileType,
  className?: string
}

export default function UserRegImage(props: Props) {

  return ( 
    <div className={classNames(styles.root, props.className)}>
        {props.type === ProfileType.Employee
        ? <Image className={styles.empImage} src={employeeImage} alt={'employeeImage'} width={550} height={527}/>
        : <BigHomeSvg className={styles.svg}/>
        }
      </div>
  )
}