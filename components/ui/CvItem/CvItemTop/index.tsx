import { ICV } from 'data/interfaces/ICV'
import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import UserPic from '../../UserPic'
import Formatter from 'utils/formatter'
import P from '../../P'

interface Props {
  cv: ICV
  userImage?: string
}

export default function CvItemTop(props: Props) {
  const {isTabletWidth} = useAppContext().size

  return ( 
    <div className={styles.top}>
      {isTabletWidth && !props.cv.profile?.useOwnLogo &&
        <UserPic className={styles.userPic} image={props.userImage} size={60}/>
      }
      {props.cv.categories.length > 0 &&
        <P styleType={['large', 'w600']} className={styles.name}>{props.cv.categories[0].name}</P>
      }
      <P styleType={['medium', 'w500', 'greyLight']} className={styles.sub}>
        {props.cv.profile?.firstName} {props.cv.profile?.lastName} {props.cv.age&&props.cv.age +' '+ Formatter.pluralize(props.cv.age, 'год', 'года', 'лет')} 
      </P>
    </div>
  )
}

