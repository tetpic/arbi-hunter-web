import styles from './index.module.scss'
import InputField from 'components/fields/InputField'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import UserRepository from 'data/repositories/UserRepository'
import { Form, FormikHelpers, FormikProvider, useFormik,} from 'formik'
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

  const userContext = useUserContext()
  const appContext = useAppContext()

  const passwordHandler = () => {
    setPasswordOpen(!passwordIsOpen)
  }

  const submitPassword = async(data: PersonalPassword, helpers: FormikHelpers<PersonalPassword>) => {
    if(data.newPassword !== data.repeatPassword) {
      appContext.showSnackbar('Пароли не совпадают', SnackbarType.error)
      return
    }
    
    if(confirm('Изменить существующий пароль на новый?')) {
      UserRepository.passwordChangeConfirmation(data).then(res=>{
        userContext.setToken(res.accessToken)
        appContext.showSnackbar('Пароль успешно изменен', SnackbarType.success)
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
        label={'Cтарый пароль:'}
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
        label={'Новый пароль:'}
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
        label={'Подтвердите новый пароль:'}
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
          <Button className={styles.button} type='submit'>Сохранить</Button>
          <Button type='button' onClick={userContext.removeCurrentProfile} className={styles.blackButton}>Удалить аккаунт</Button>
        </div>
      </Form>
    </FormikProvider>
  )
}