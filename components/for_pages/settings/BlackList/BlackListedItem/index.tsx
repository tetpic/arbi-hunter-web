import UserPic from '@/components/ui/UserPic'
import styles from './index.module.scss'
import { IVacancy } from 'data/interfaces/IVacancy'
import P from '@/components/ui/P'
import { getCategoryName, getSalary, getUserName } from 'utils/helpers'
import Button from '@/components/ui/Button'
import { IUserProfile } from 'data/interfaces/IUser'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'
import { ICV } from 'data/interfaces/ICV'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  vacancy?: IVacancy
  cv?: ICV
  profile?: IUserProfile
  onRestore?: () => void
}

export default function BlackListedItem(props: Props) {
  const {t, lang} = useTranslation()


  return (<div className={styles.root}> 
   <div className={styles.top}>
      <UserPic size={42} image={props.profile?.logo?.source&&ImageHelper.urlFromFile(props.profile.logo, Preset.smallIconCrop)}/>
      <div className={styles.topInfo}>
        <P useThemeColor styleType={['large', 'w600']}>{props.vacancy?.company||getUserName(props.profile)}</P>
        <P useThemeColor styleType={['medium', 'w500', 'greyLight']}>{props.vacancy?.city?.locName||props.cv?.city?.locName||props.profile?.city?.locName}</P>
      </div>
   </div>
   {(props.vacancy || props.cv) &&
   <>
    <P useThemeColor styleType={['large', 'w600']}>{props.vacancy?.name||getCategoryName(props.cv.categories[0], lang)}</P>
    <P useThemeColor>{getSalary({vacancy: props.vacancy, cv: props.cv}, t)}</P>
   </>
   }
   <Button className={styles.button} onClick={()=>props.onRestore?.()} styleType={['gradient', 'phoneWide']}>{t('restore')}</Button>

  </div>)
}