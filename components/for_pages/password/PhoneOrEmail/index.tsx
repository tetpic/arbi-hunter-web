import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import InputField from 'components/fields/InputField'
import Validator from 'utils/Validator'
import Button from 'components/ui/Button'
import P from '@/components/ui/P'
import { SnackbarType } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'
import RegistrationRepository from 'data/repositories/RegistrationRepository'
import { useFormikContext } from 'formik'
import { RestoreFields } from '..'

interface Props {
  onComplete?: () => void
}

export default function PhoneOrEmail(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const formik = useFormikContext<RestoreFields>()


  const checkEmail = async () => {   
    const isRegistered = await RegistrationRepository.checkEmailOrPhoneExists(formik.values.email)
    .then(res => {
      if(!res.exists || !res.isRegistrationCompleted || res.profilesCount === 0) {
        return false
      }
      else {
        return true
      }
    })
    if(!isRegistered) {
      appContext.showSnackbar(t('login_accountNotExist'), SnackbarType.error)
      return 
    }
    else {
      props.onComplete()
    }
  }

  return (
    <div className={styles.form}>
      <P styleType={['medium', 'w500']} useThemeColor>{t('login_enterEmailTip')}</P>
        <InputField   
        label={'E-mail:'}
        className={styles.input} 
        labelType='top' 
        styleType={'default'} 
        color={'default'} 
        name={'email'} 
        validate={Validator.combine([Validator.required, Validator.email])}
        />
        <div className={styles.buttonsWrapper}>
          <Button className={styles.nextButton}  styleType={['gradient', 'phoneWide']} altStyleType={['gradient']} type='button' onClick={checkEmail}><span>{t('next')}</span></Button>
        </div>
    </div>
)
}