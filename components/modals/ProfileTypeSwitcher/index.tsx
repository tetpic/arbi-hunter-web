import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from 'components/layout/Modal/ModalBody'
import { useUserContext } from 'context/user_state'
import classNames from 'classnames'
import { ProfileType } from 'data/interfaces/IRegistration'
import UserSvg from 'components/svg/UserSvg'
import { colors } from 'styles/variables'
import Button from 'components/ui/Button'
import Image from 'next/image'
import BriefCaseAltSvg from 'components/svg/BriefCaseAltSvg'
import { useAppContext } from 'context/state'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: () => void
}

export default function ProfileTypeSwitcher(props: Props) {
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {t} = useTranslation()


  const body = (
    <div className={styles.root}>
      <div className={styles.imageWrapper}>
        <Image src={'/favicon.svg'} alt={'logo'} width={110} height={110}/>
      </div>

      <p className={styles.heading}>{t('registration_switcher_setRegMethod')}</p>
      <div className={styles.types}>
        <div onClick={() =>userContext.setProfileType(ProfileType.Employee)} className={classNames(styles.item, userContext.profileType === ProfileType.Employee && styles.active)}>
          <UserSvg  color={userContext.profileType === ProfileType.Employee && colors.blueLight}/>
          <p className={styles.title}>{t('registration_employee')}</p>
          <p className={styles.subTitle}>{t('registration_workForMe')}</p>
        </div>
        <div onClick={() =>userContext.setProfileType(ProfileType.Hirer )} className={classNames(styles.item, userContext.profileType === ProfileType.Hirer && styles.active)}>
          <BriefCaseAltSvg  color={userContext.profileType === ProfileType.Hirer && colors.blueLight}/>
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