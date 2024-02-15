// import { ICV } from 'data/interfaces/ICV'
// import styles from './index.module.scss'
// import Link from 'next/link'
// import LikeButton from '@/components/ui/LikeButton'
// import { ActivityStatus } from 'types/enums'
// import { getUserImageSource } from 'utils/helpers'
// import UserPic from '@/components/ui/UserPic'
// import P from '@/components/ui/P'
// import { TranslateWorkExperience } from 'utils/enumsTranslations'

// interface Props {
//   cv: ICV
//   onLikeClick: (id: number)=> void
// }

// export default function FavoritesCvItem({cv, onLikeClick}: Props) {


//   const isOnline = cv.profile.activityStatus === ActivityStatus.Online
//   const image = getUserImageSource(cv.profile)
//   const name = [cv.profile.firstName, cv.profile.lastName].filter(Boolean).join(' ')
  

//   return (<Link href={'/cv/'+cv.id} className={styles.root}> 
//     <LikeButton active className={styles.like} onClick={()=>{onLikeClick(cv.id)}}/>
//     <div className={styles.top}>
//       <UserPic className={styles.userPic} size={42} image={image}/>
//       <div className={styles.topContent}>
//         <P styleType={['medium', 'w500']}>{name}</P>
//         <P styleType={['medium', 'w500', 'greyLight']}>{cv.city.locName}</P>
//       </div>
//     </div>
//     <P styleType={['medium', 'w500']}>{cv.categories[0]?.description}</P>
//     <P styleType={['medium', 'w500']}>Опыт {TranslateWorkExperience(vacancy.experience).toLowerCase()}</P>
//     <SalaryItem vacancy={vacancy}/>
//     <P styleType={['small', 'greyLight']}>Опубликовано {Formatter.formatDate(vacancy.updatedAt)}</P>
//     {isOnline &&
//       <P styleType={['medium', 'w500', 'green']}>
//         Работодатель сейчас онлайн
//       </P>
//     }
//     {!isOnline && vacancy.profile.lastActivityAt &&
//       <P styleType={['small', 'w500', 'greyLight']} className={styles.offline}>
//         <DotSvg color={colors.red}/> Был в сети {Formatter.formatDate(vacancy.profile.lastActivityAt, {timeOptions: {year: 'numeric'}})}
//       </P>
//     }
//     {vacancy.applicationsByCurrentUser.length > 0 
//     && vacancy.applicationsByCurrentUser.find(el=>el.status === 'applied') &&
//       <div className={styles.tag}>Вас пригласили</div>
//       ||
//       vacancy.applicationsByCurrentUser.length > 0 &&
//       <div className={styles.redTag}>Вам отказали</div>
//     }
//   </Link>)
// }