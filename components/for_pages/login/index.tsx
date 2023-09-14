import classnames from 'classnames'
import InputField from 'components/fields/InputField'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import { useResize } from 'components/hooks/useResize'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import BackBtn from 'components/ui/BackBtn'
import Button from 'components/ui/Button'
import UserRegImage from 'components/ui/UserRegImage'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import { ILogin } from 'data/interfaces/IRegistration'
import UserRepository from 'data/repositories/UserRepository'
import { Form, FormikProvider, useFormik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { SnackbarType } from 'types/enums'
import Validator from 'utils/Validator'
import styles from './index.module.scss'

interface Props {
}

export default function Login(props: Props) {
  const router = useRouter()
  const userContext = useUserContext()
  const appContext = useAppContext()

  const {isTabletWidth} = useResize()
  const [loginType, setLoginType] = useState<string>('phone')
  const [passwordIsOpen, setPasswordOpen] = useState<boolean>(false)
 

  const passwordHandler = () => {
    setPasswordOpen(!passwordIsOpen)
  }

  const initialValues: ILogin = {
    login: '',
    password: ''
  }

  const submit = (data : ILogin) => {    
    UserRepository.loginByEmailOrPhone(data)
    .then(res=> {      
      userContext.setToken(res.accessToken)
      router.push('/')
    })
    .catch(err=> {
      appContext.showSnackbar(err.errors, SnackbarType.error)
    })
  }
 

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: submit
  })


  const changeLoginTypeHandler = (s: 'email'|'phone') => {
    setLoginType(s)
    formik.resetForm()
  }


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

            <p className={styles.subTitle}>Войти через</p>            

            <div className={styles.buttonsWrapper}>
              <Button type='button' className={classnames(styles.button, loginType === 'phone'&&styles.button_active)} onClick={()=>changeLoginTypeHandler('phone')}>Телефон</Button>
              <Button type='button' className={classnames(styles.button, loginType === 'email'&&styles.button_active)} onClick={()=>changeLoginTypeHandler('email')}>E-mail</Button>
            </div>

            {loginType=== 'email' &&
              <InputField   
              label={'E-mail:'}
              className={styles.input} 
              labelType='top' 
              styleType={'default'} 
              color={'default'} 
              name={'login'} 
              validate={Validator.combine([Validator.required, Validator.email])}
              />
            }

            {loginType === 'phone' &&
              <PhoneCountryField 
              styleType={'horizontal'} 
              disabled={false} placeholder={'000 000 00 00'} 
              name={'login'}  
              inputClassName={styles.input} 
              defaultCountry={'RU'}
              label={'Телефон:'}
              />
            }

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