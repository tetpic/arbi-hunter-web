import UserPic from '@/components/ui/UserPic'
import styles from './index.module.scss'

import { getUserImageSource, getUserName } from 'utils/helpers'
import { ActivityStatus, InterfaceLanguage, Preset } from 'types/enums'
import { ProfileType } from 'data/interfaces/IRegistration'
import P from '@/components/ui/P'
import Formatter from 'utils/formatter'
import { IView } from 'data/interfaces/IView'
import useTranslation from 'next-translate/useTranslation'
import Button from '@/components/ui/Button'
import DotSvg from '@/components/svg/DotSvg'
import { colors } from 'styles/variables'
import Link from 'next/link'

interface Props {
  view: IView
}

export default function ViewItem(props: Props) {
  const userType = props.view.profile.profileType
  const profile = props.view.profile
  
  const {t, lang} = useTranslation()

  return (<Link className={styles.root} href={'/personal/' + profile.id}> 
    <div className={styles.top}>
      <UserPic className={styles.userPic} straightSizes image={getUserImageSource(profile, Preset.smallIconCrop)}  size={42}/>
      <P style={{gridArea: 'n'}} useThemeColor styleType={['large', 'w600']}>{(userType=== ProfileType.Employee&&getUserName(profile))||profile.company}</P>
      <P style={{gridArea: 'd'}} styleType={['greyLight', 'small', 'w500']}>{userType === ProfileType.Hirer?profile.city?.locName:Formatter.formatDistanceToNow(profile.birthday, {strict: true})}</P>
    </div>
    <P 
    styleType={['medium', 'w500', 'alignCenter',  profile.activityStatus === ActivityStatus.Online?'green':'greyLight']}>
      <DotSvg color={profile.activityStatus === ActivityStatus.Online?colors.green:colors.red}/> 
      {profile.activityStatus === ActivityStatus.Online?t('views_onlineNow'): t('views_offline')  + Formatter.formatDate(profile.lastActivityAt, {lang: lang as InterfaceLanguage||InterfaceLanguage.Russian} )}
    </P>
    <div className={styles.watched}>
      <P styleType={['medium', 'w500', 'greyLight']}>{t('views_watched')}</P>
      <P styleType={['medium', 'w500']} useThemeColor>{Formatter.formatDate(props.view.createdAt, {lang: lang as InterfaceLanguage||InterfaceLanguage.Russian, timeOptions: {hour: 'numeric', minute: 'numeric', year: 'numeric'}} )}</P>
    </div>
    <Button styleType={['gradient', 'phoneWide']}>{userType === ProfileType.Hirer?t('views_companyProfile'): t('views_employeeProfile')}</Button>
  </Link>)
}