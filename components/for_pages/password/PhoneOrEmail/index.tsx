import { Form, FormikProvider, useFormik } from 'formik'
import styles from './index.module.scss'
import { ILogin } from 'data/interfaces/IRegistration'
import { IRegistrationModalProps } from 'components/modals/RegistrationModal'
import { useAppContext } from 'context/state'
import InputField from 'components/fields/InputField'
import Validator from 'utils/Validator'
import Button from 'components/ui/Button'
import P from '@/components/ui/P'
import { ModalType } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'



export default function PhoneOrEmail() {
  const {t} = useTranslation()
  const appContext = useAppContext()

  const initialValues: ILogin = {
    phone: '',
    email: '',
  }

  const submit = (data : ILogin) => {   
    appContext.showModal<IRegistrationModalProps>(ModalType.RegistrationModal, {
      email: formik.values.email,
      onComplete: () => {
      }
    })
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: submit
  })

  const onInputEnterPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if(e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()
      formik.validateForm()
      .then(_=> {
        formik.submitForm()
      })
    }
  }

  return (
  <FormikProvider value={formik}>
    <Form onKeyDown={e=>onInputEnterPress(e)} className={styles.form}>
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
      <Button className={styles.submitButton} type='button' onClick={()=>formik.submitForm()}><span>{t('next')}</span></Button>
    </Form>
  </FormikProvider>)
}