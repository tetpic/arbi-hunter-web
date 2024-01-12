import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from 'components/layout/Modal/ModalBody'
import { Form, FormikProvider, useFormik } from 'formik'
import PasswordField from 'components/fields/PasswordField'
import Button from 'components/ui/Button'
import { useUserContext } from 'context/user_state'
import UserRepository from 'data/repositories/UserRepository'
import { SnackbarType } from 'types/enums'
import { useAppContext } from 'context/state'

interface Props {
  // onClose: () => void
}

export default function NewPasswordModal(props: Props) {
  const userContext = useUserContext()
  const appContext = useAppContext()


  const submit = (data: any) => {
    UserRepository.passwordChangeConfirmation(data).then(res=>{
      userContext.setToken(res.accessToken)
      appContext.showSnackbar('Пароль успешно изменен', SnackbarType.success)
      appContext.hideModal()
    })
    .catch(err=> alert(err.toString()))
  } 

  const formik = useFormik<{newPassword: string}>({
    initialValues: {
      newPassword: ''
    },
    onSubmit: submit
  })

  const body = (
    <div className={styles.root}>
      <p className={styles.title}>Введите новый пароль</p>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          <PasswordField name='newPassword'/>
        </Form>
        <Button onClick={formik.submitForm} className={styles.button}>Изменить</Button>
      </FormikProvider>
    </div>
  )

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>
  )
}