import InputField from 'components/fields/InputField'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import UserRepository from 'data/repositories/UserRepository'
import { Form, FormikHelpers, FormikProvider, useField, useFormik, useFormikContext } from 'formik'
import { useState } from 'react'
import { SnackbarType } from 'types/enums'
import Validator from 'utils/Validator'
import styles from './index.module.scss'

interface Props {
}

interface PersonalPassword {
  newPassword: string
}

export default function ChangePassword(props: Props) {

  const [passwordIsOpen, setPasswordOpen] = useState<boolean>(false)  

  const userContext = useUserContext()
  const appContext = useAppContext()



  const passwordHandler = () => {
    setPasswordOpen(!passwordIsOpen)
  }

  const submitPassword = (data: PersonalPassword, helpers: FormikHelpers<PersonalPassword>) => {
    if(confirm('Изменить существующий пароль на новый?')) {
      UserRepository.passwordChangeConfirmation(data).then(res=>{
        userContext.setToken(res.accessToken)
        appContext.showSnackbar('Пароль успешно изменен', SnackbarType.success)
        helpers.resetForm()
      })
      .catch(err=> alert(err.toString()))
    }
  }

  const passwordFormik = useFormik<PersonalPassword>({
    initialValues: {
    newPassword: ''
    },
    onSubmit: (values, helpers) => submitPassword(values, helpers)
  })

  return (
    <FormikProvider value={passwordFormik}>
      <Form className={styles.root}>
      
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
        validate={Validator.required}
        />
        <Button className={styles.button}>Сохранить</Button>
      </Form>
    </FormikProvider>
  )
}