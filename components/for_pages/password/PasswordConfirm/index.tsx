import PasswordField from 'components/fields/PasswordField'
import { Form, FormikProvider, useFormik } from 'formik'
import styles from './index.module.scss'
import Button from 'components/ui/Button'
import UserRepository from 'data/repositories/UserRepository'
import { useUserContext } from 'context/user_state'
import { useAppContext } from 'context/state'
import { SnackbarType } from 'types/enums'
import { useRouter } from 'next/navigation'

interface Props {
}

interface Passwords {
  newPassword: string,
  newPasswordRepeat: string
}

export default function PasswordConfirm(props: Props) {
  const userContext = useUserContext()
  const appContext = useAppContext()
  const router = useRouter()

  const submit = (data: Passwords) =>  {
    if(data.newPassword === data.newPasswordRepeat) {
      UserRepository.passwordChangeConfirmation(data).then(res=>{
        userContext.setToken(res.accessToken)
        appContext.showSnackbar('Пароль успешно изменен', SnackbarType.success)
        router.push('/')
      })
      .catch(err=> alert(err.toString()))
    }
    else {
      appContext.showSnackbar('Пароли не совпадают', SnackbarType.error)
    }
  }

  const formik = useFormik<Passwords>({
    initialValues: {
      newPassword: '',
      newPasswordRepeat: ''
    },
    onSubmit: submit
  })

  return (<FormikProvider value={formik}>
    <Form className={styles.form}>
      <PasswordField 
      className={styles.input} 
      name='newPassword' 
      label='Пароль' 
      />

      <PasswordField 
      className={styles.input} 
      name='newPasswordRepeat' 
      label='Повторите пароль'/>

      <Button disabled={formik.isSubmitting} isProcess={formik.isSubmitting}  className={styles.submitButton}><span>Восстановить</span></Button>
    </Form>
  </FormikProvider>)
}