import { ICV } from 'data/interfaces/ICV'
import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import UserPic from '../../UserPic'
import Formatter from 'utils/formatter'
import P from '../../P'
import { ActivityStatus } from 'types/enums'

interface Props {
  cv: ICV
  userImage?: string
}

export default function CvItemTop(props: Props) {
  const {isTabletWidth} = useAppContext().size

  return ( 
    <div className={styles.top}>
      {!props.cv.profile?.useOwnLogo &&
        <UserPic className={styles.userPic} image={props.userImage} size={46}/>
      }
      {props.cv.categories.length > 0 &&
        <P styleType={['large', 'w600']} className={styles.name}>{props.cv.categories[0].name}</P>
      }
      {props.cv.profile.activityStatus === ActivityStatus.Online &&
        <P styleType={['medium', 'w500', 'green']} className={styles.sub}>Сейчас онлайн</P>
      }
      {props.cv.profile.lastActivityAt && props.cv.profile.activityStatus === ActivityStatus.Offline &&
        <P styleType={['medium', 'w500', 'greyLight']} className={styles.sub}>Был в сети {Formatter.formatDateRelative(props.cv.profile.lastActivityAt)}</P>
      }
      {/* {props.cv.isContactsOpen &&
        <P styleType={['medium', 'w500', 'greyLight']} className={styles.sub}>
          {props.cv.profile?.firstName} {props.cv.profile?.lastName} {props.cv.age&&props.cv.age +' '+ Formatter.pluralize(props.cv.age, 'год', 'года', 'лет')} 
        </P>
      } */}
    </div>
  )
}

