import styles from './index.module.scss'
import InputField from 'components/fields/InputField'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import UserRepository from 'data/repositories/UserRepository'
import { Form, FormikHelpers, FormikProvider, useFormik,} from 'formik'
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import { SnackbarType } from 'types/enums'
import Validator from 'utils/Validator'

interface Props {
}

interface PersonalPassword {
  newPassword: string,
  oldPassword: string,
  repeatPassword: string
}

export default function ChangePassword(props: Props) {
  const [passwordIsOpen, setPasswordOpen] = useState<boolean>(false)  
  const {t} = useTranslation()

  const userContext = useUserContext()
  const appContext = useAppContext()

  const passwordHandler = () => {
    setPasswordOpen(!passwordIsOpen)
  }

  const submitPassword = async(data: PersonalPassword, helpers: FormikHelpers<PersonalPassword>) => {
    if(data.newPassword !== data.repeatPassword) {
      appContext.showSnackbar(t('login_passwordsAreNotSame'), SnackbarType.error)
      return
    }
    
    if(confirm(t('login_changePasswordQuestion'))) {
      UserRepository.passwordChangeConfirmation(data).then(res=>{
        userContext.setToken(res.accessToken)
        appContext.showSnackbar(t('login_passwordRestoreComplete'), SnackbarType.success)
        helpers.resetForm()
      })
      .catch(err=> appContext.showSnackbar(err.message, SnackbarType.error))
    }
  }

  const passwordFormik = useFormik<PersonalPassword>({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      repeatPassword: ''
    },
    onSubmit: (values, helpers) => submitPassword(values, helpers)
  })


  return (
    <FormikProvider value={passwordFormik}>
      <Form className={styles.root}>
        <InputField 
        label={t('login_oldPassword')}
        className={styles.input} 
        labelType='top' 
        styleType={'default'} 
        color={'default'} 
        name={'oldPassword'} 
        type={passwordIsOpen?'text':'password'}
        suffix={'icon'}
        suffixIcon={passwordIsOpen?<OpenEyeSvg/>: <CloseEyeSvg/>}
        onSuffixClick={passwordHandler}
        validate={Validator.combine([Validator.required, Validator.minPasswordLength])}
        />
        <InputField 
        label={t('login_newPassword')}
        className={styles.input} 
        labelType='top' 
        styleType={'default'} 
        color={'default'} 
        name={'newPassword'} 
        type={passwordIsOpen?'text':'password'}
        suffix={'icon'}
        suffixIcon={passwordIsOpen?<OpenEyeSvg/>: <CloseEyeSvg/>}
        onSuffixClick={passwordHandler}
        validate={Validator.combine([Validator.required, Validator.minPasswordLength])}
        />
        <InputField 
        label={t('login_confirmPassword')}
        className={styles.input} 
        labelType='top' 
        styleType={'default'} 
        color={'default'} 
        name={'repeatPassword'} 
        type={passwordIsOpen?'text':'password'}
        suffix={'icon'}
        suffixIcon={passwordIsOpen?<OpenEyeSvg/>: <CloseEyeSvg/>}
        onSuffixClick={passwordHandler}
        validate={Validator.combine([Validator.required, Validator.minPasswordLength])}
        />
        <div className={styles.buttonsWrapper}>
          <Button styleType={['gradient', 'phoneWide']} className={styles.saveButton} type='submit'>{t('save')}</Button>
          <Button  styleType={['black', 'phoneWide']} altStyleType={['white', 'phoneWide']} type='button' onClick={userContext.removeCurrentProfile} className={styles.deleteButton}>{t('login_removeAccount')}</Button>
        </div>
      </Form>
    </FormikProvider>
  )
}