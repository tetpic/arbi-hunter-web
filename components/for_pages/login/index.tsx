import InputField from 'components/fields/InputField'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import { useResize } from 'components/hooks/useResize'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import BackBtn from 'components/ui/BackBtn'
import UserRegImage from 'components/ui/UserRegImage'
import { useUserContext } from 'context/user_state'
import { IRegistrationComplete } from 'data/interfaces/IRegistration'
import { Form, FormikProvider, useFormik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Validator from 'utils/Validator'
import styles from './index.module.scss'

interface Props {
}

export default function Login(props: Props) {
  const userContext = useUserContext()
  const {isTabletWidth} = useResize()
  const router = useRouter()
  
  const [passwordIsOpen, setPasswordOpen] = useState<boolean>(false)

  const passwordHandler = () => {
    setPasswordOpen(!passwordIsOpen)
  }


  const initialValues: Partial<IRegistrationComplete> = {
    email: '',
    phone: '',
    password: ''
  }

  const submit = (data : Partial<IRegistrationComplete>) => {
    debugger
  }
 

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: submit
  })


  return ( 
    <div className={styles.root}>
      {!isTabletWidth&& 
      <UserRegImage type={userContext.profileType} className={styles.regImage}/>
      }
      <div className={styles.content}>
        <p className={styles.title}>
          {isTabletWidth&&<BackBtn onClick={()=>{router.back()}} bgColor={'white'}/>}
          Войти
        </p>
        <p className={styles.subTitle}>
          Еще нет аккаунта? 
          <Link className={styles.loginLink} href={'/registration'}>
            Зарегистрируйтесь
          </Link>
        </p>
        <FormikProvider value={formik}>
          <Form className={styles.form}>

            <InputField   
            label={'E-mail:'}
            className={styles.input} 
            labelType='top' 
            styleType={'default'} 
            color={'default'} 
            name={'email'} 
            validate={Validator.combine([Validator.required, Validator.email])}
            />

            <PhoneCountryField 
            styleType={'horizontal'} 
            disabled={false} placeholder={'000 000 00 00'} 
            name={'phone'}  
            inputClassName={styles.input} 
            defaultCountry={'RU'}
            label={'Телефон:'}
            />

            <InputField 
            label={'Пароль:'}
            className={styles.input} 
            labelType='top' 
            styleType={'default'} 
            color={'default'} 
            name={'password'} 
            type={passwordIsOpen?'text':'password'}
            suffix={'icon'}
            suffixIcon={passwordIsOpen?<OpenEyeSvg/>: <CloseEyeSvg/>}
            onSuffixClick={passwordHandler}
            validate={Validator.required}
            />

            <p className={styles.subTitle}>Забыли пароль?</p>
            
            <div className={styles.submitButton} onClick={formik.submitForm}>Войти</div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  )
}