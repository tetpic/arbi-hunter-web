import UserPic from '@/components/ui/UserPic'
import styles from './index.module.scss'
import { IVacancy } from 'data/interfaces/IVacancy'
import P from '@/components/ui/P'
import { getSalary, getUserName } from 'utils/helpers'
import Button from '@/components/ui/Button'
import { IUserProfile } from 'data/interfaces/IUser'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'

interface Props {
  vacancy?: IVacancy
  profile?: IUserProfile
  onRestore?: () => void
}

export default function BlackListedItem(props: Props) {


  return (<div className={styles.root}> 
   <div className={styles.top}>
      <UserPic size={42} image={props.profile?.logo?.source&&ImageHelper.urlFromFile(props.profile.logo, Preset.smallIconCrop)}/>
      <div className={styles.topInfo}>
        <P useThemeColor styleType={['large', 'w600']}>{props.vacancy?.company||getUserName(props.profile)}</P>
        <P useThemeColor styleType={['medium', 'w500', 'greyLight']}>{props.vacancy?.city?.locName||props.profile?.city?.locName}</P>
      </div>
   </div>
   {props.vacancy &&
   <>
    <P useThemeColor styleType={['large', 'w600']}>{props.vacancy.name}</P>
    <P useThemeColor>{getSalary({vacancy: props.vacancy})}</P>
   </>
   }
   <Button className={styles.button} onClick={()=>props.onRestore?.()} styleType={['gradient']}>Восстановить</Button>

  </div>)
}