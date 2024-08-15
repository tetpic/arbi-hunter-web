import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from 'components/layout/Modal/ModalBody'
import { useUserContext } from 'context/user_state'
import classNames from 'classnames'
import { ProfileType } from 'data/interfaces/IRegistration'
import { colors } from 'styles/variables'
import Button from 'components/ui/Button'
import Image from 'next/image'
import BriefCaseAltSvg from 'components/svg/BriefCaseAltSvg'
import { useAppContext } from 'context/state'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import BackBtn from '@/components/ui/BackBtn'
import P from '@/components/ui/P'
import UserAltSvg from '@/components/svg/UserAltSvg'
import { AppTheme } from 'types/enums'

interface Props {
  onClose: () => void
}

export default function ProfileTypeSwitcher(props: Props) {
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {t} = useTranslation()
  const router = useRouter()
  const theme = appContext.theme


  const body = (
    <div className={styles.root}>
      <BackBtn className={styles.backBtn} onClick={() => {
        router.back()
        props.onClose()
      }}/>
      <div className={styles.imageWrapper}>
        <Image src={'/favicon.svg'} alt={'logo'} width={110} height={110}/>
      </div>
      {/* color: $white;
  font-size: 24px;
  text-align: center;
  font-weight: $semibold; */}
      <P useThemeColor styleType={['w600', 'textCenter', 'huge']} className={styles.heading}>{t('registration_switcher_setRegMethod')}</P>
      <div className={styles.types}>
        <div onClick={() =>userContext.setProfileType(ProfileType.Employee)} className={classNames(styles.item, userContext.profileType === ProfileType.Employee && styles.active)}>
          <UserAltSvg  color={userContext.profileType === ProfileType.Employee ? colors.blueLight : theme === AppTheme.Light ? colors.black : colors.white} />
          <p className={styles.title}>{t('registration_employee')}</p>
          <p className={styles.subTitle}>{t('registration_workForMe')}</p>
        </div>
        <div onClick={() =>userContext.setProfileType(ProfileType.Hirer )} className={classNames(styles.item, userContext.profileType === ProfileType.Hirer && styles.active)}>
          <BriefCaseAltSvg  color={userContext.profileType === ProfileType.Hirer ? colors.blueLight : theme === AppTheme.Light ? colors.black : colors.white} />
          <p className={styles.title}>{t('registration_company')}</p>
          <p className={styles.subTitle}>{t('registration_wantFindEmployees')}</p>
        </div>
      </div>
      <div className={styles.buttonsWrapper}>
        <Button className={styles.submitButton} onClick={()=> appContext.hideModal()}><span>{t('continue')}</span></Button>
      </div>
    </div>
  )

  return (
    <ModalLayout mobileFullScreen className={styles.modalLayout}>
      <ModalBody className={styles.modalBody}>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}