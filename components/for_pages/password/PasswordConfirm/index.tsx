import PasswordField from 'components/fields/PasswordField'
import {useFormikContext } from 'formik'
import styles from './index.module.scss'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { SnackbarType } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'
import { RestoreFields } from '..'

interface Props {
  onComplete: () => void
}


export default function PasswordConfirm(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const formik = useFormikContext<RestoreFields>()

  const checkPasswords = () =>  {
    if(formik.values.newPassword === formik.values.newPasswordRepeat) {
      props.onComplete()     
    }
    else {
      appContext.showSnackbar(t('login_passwordsAreNotSame'), SnackbarType.error)
    }
  }

  return (
    <div className={styles.form}>
      <PasswordField 
      className={styles.input} 
      name='newPassword' 
      label={t('login_enterNewPassword')} 
      />

      <PasswordField 
      className={styles.input} 
      name='newPasswordRepeat' 
      label={t('login_repeatPassword')}/>

      <Button type='button' disabled={formik.isSubmitting} onClick={checkPasswords} isProcess={formik.isSubmitting}  className={styles.submitButton}><span>{t('login_restorePassword')}</span></Button>
    </div>  
  )
}