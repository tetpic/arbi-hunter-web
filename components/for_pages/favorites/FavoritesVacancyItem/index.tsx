import { IVacancy } from 'data/interfaces/IVacancy'
import styles from './index.module.scss'
import UserPic from '@/components/ui/UserPic'
import P from '@/components/ui/P'
import SalaryItem from '@/components/ui/SalaryItem'
import Formatter from 'utils/formatter'
import { ActivityStatus, Preset } from 'types/enums'
import DotSvg from '@/components/svg/DotSvg'
import { colors } from 'styles/variables'
import { TranslateWorkExperience } from 'utils/enumsTranslations'
import Link from 'next/link'
import { getUserImageSource } from 'utils/helpers'
import LikeButton from '@/components/ui/LikeButton'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  vacancy: IVacancy
  onLikeClick?: (id: number)=> void
}

export default function FavoritesVacancyItem({vacancy, onLikeClick}: Props) {
  const {t} = useTranslation()
  const isOnline = vacancy.profile.activityStatus === ActivityStatus.Online
  const image = getUserImageSource(vacancy.profile, Preset.smallIconCrop)
  

  return (<Link href={'/vacancy/'+vacancy.id} className={styles.root}> 
    <LikeButton active className={styles.like} onClick={()=>{onLikeClick(vacancy.id)}}/>
    <div className={styles.top}>
      <UserPic className={styles.userPic} size={42} image={image}/>
      <div className={styles.topContent}>
        <P styleType={['medium', 'w500']}>{vacancy.company||vacancy.contactName}</P>
        <P styleType={['medium', 'w500', 'greyLight']}>{vacancy.city.locName}</P>
      </div>
    </div>
    <P styleType={['medium', 'w500']}>{vacancy.name||vacancy.categories[0]?.description}</P>
    <P styleType={['medium', 'w500']}>Опыт {TranslateWorkExperience(vacancy.experience, t).toLowerCase()}</P>
    <SalaryItem vacancy={vacancy}/>
    <P styleType={['small', 'greyLight']}>Опубликовано {Formatter.formatDate(vacancy.updatedAt)}</P>
    {isOnline &&
      <P styleType={['medium', 'w500', 'green']}>
        Работодатель сейчас онлайн
      </P>
    }
    {!isOnline && vacancy.profile.lastActivityAt &&
      <P styleType={['small', 'w500', 'greyLight']} className={styles.offline}>
        <DotSvg color={colors.red}/> Был в сети {Formatter.formatDate(vacancy.profile.lastActivityAt, {timeOptions: {year: 'numeric'}})}
      </P>
    }
    {vacancy.applicationsByCurrentUser.length > 0 
    && vacancy.applicationsByCurrentUser.find(el=>el.status === 'applied') &&
      <div className={styles.tag}>Вас пригласили</div>
      ||
      vacancy.applicationsByCurrentUser.length > 0 &&
      <div className={styles.redTag}>Вам отказали</div>
    }
  </Link>)
}