import { Form, FormikProvider, useFormik } from 'formik'
import styles from './index.module.scss'
import Modes from 'components/ui/Modes'
import { LoginType, ModalType } from 'types/enums'
import { useState } from 'react'
import { ILogin } from 'data/interfaces/IRegistration'
import { IRegistrationModalProps } from 'components/modals/RegistrationModal'
import { useAppContext } from 'context/state'
import InputField from 'components/fields/InputField'
import Validator from 'utils/Validator'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import Button from 'components/ui/Button'



export default function PhoneOrEmail() {
  const [loginType, setLoginType] = useState<LoginType>(LoginType.Phone)
  const appContext = useAppContext()

  const initialValues: ILogin = {
    phone: '',
    email: '',
  }

  const submit = (data : ILogin) => {   
    appContext.showModal<IRegistrationModalProps>(ModalType.RegistrationModal, {
      [loginType]: formik.values[loginType],
      onComplete: () => {
        
        // appContext.hideModal()
        // router.push('/')
        // setTimeout(()=>{
        //   appContext.showModal(ModalType.NewPasswordModal, {nonSkippable: true})
        // }, 200)
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

  const changeLoginTypeHandler = (s: LoginType) => {
    setLoginType(s)
    formik.resetForm()
  }


  return (
  <FormikProvider value={formik}>
    <Form onKeyDown={e=>onInputEnterPress(e)} className={styles.form}>
      <Modes 
      className={styles.modes}
      buttonClassName={styles.modesButtons}
      buttons={[
        {name: 'Телефон', type: LoginType.Phone},
        {name: 'Почта', type: LoginType.Email}
      ]} 
      activeButton={loginType} 
      onSet={(type)=> changeLoginTypeHandler(type)}
      />   
      {loginType=== LoginType.Email &&
        <InputField   
        label={'E-mail:'}
        className={styles.input} 
        labelType='top' 
        styleType={'default'} 
        color={'default'} 
        name={'email'} 
        validate={Validator.combine([Validator.required, Validator.email])}
        />
      }
      {loginType === LoginType.Phone &&
        <PhoneCountryField 
        styleType={'horizontal'} 
        disabled={false} 
        placeholder={'000 000 00 00'} 
        name={'phone'}  
        className={styles.input} 
        defaultCountry={'RU'}
        label={'Телефон:'}
        validate={Validator.combine([Validator.required, Validator.phone])}
        />
      }
      <Button className={styles.submitButton} type='button' onClick={()=>formik.submitForm()}><span>Далее</span></Button>
    </Form>
  </FormikProvider>)
}