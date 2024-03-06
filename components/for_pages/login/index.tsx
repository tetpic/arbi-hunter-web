import styles from './index.module.scss'

import InputField from 'components/fields/InputField'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import BackBtn from 'components/ui/BackBtn'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import { ILogin} from 'data/interfaces/IRegistration'
import UserRepository from 'data/repositories/UserRepository'
import { Form, FormikProvider, useFormik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { LoginType, SnackbarType } from 'types/enums'
import Validator from 'utils/Validator'
import Modes from 'components/ui/Modes'
import Button from 'components/ui/Button'
// import Rive from '@rive-app/react-canvas'
import UserRegImage from 'components/ui/UserRegImage'



export default function Login() {
  const router = useRouter()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  const [loginType, setLoginType] = useState<LoginType>(LoginType.Phone)
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
    })
    .catch(err=> {
      let errString: string
      if(err.message === 'Wrong login or password') {
        errString = 'Неправильный логин или пароль'
      }
      else if(err.message === 'Network Error') {
        errString = 'Прервано соединение с интернетом'
      }
      appContext.showSnackbar(errString, SnackbarType.error)
    })
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: submit
  })

  const changeLoginTypeHandler = (s: LoginType) => {
    setLoginType(s)
    formik.resetForm()
  }

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

  // const memoedRive = useMemo(()=>{
  //   const src = userContext.profileType===ProfileType.Hirer?'/rive/login/company.riv':'/rive/login/user_RU.riv'
  //   return <Rive src={src} key={src} className={styles.regImage}/>
  // }, [userContext.currentProfile])

  useEffect(()=>{
    if(userContext.currentProfile) {
      router.replace('/')
    }
  }, [userContext.currentProfile])

  useEffect(()=>{
    userContext.logout(true)
  }, [])

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
              data-testid={'email'}
              labelType='top' 
              styleType={'default'} 
              color={'default'} 
              name={'login'} 
              validate={Validator.combine([Validator.required, Validator.email])}
              />
            }
            {loginType === LoginType.Phone &&
              <PhoneCountryField 
              styleType={'horizontal'} 
              disabled={false} 
              placeholder={'000 000 00 00'} 
              name={'login'}  
              className={styles.input} 
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
            validate={Validator.combine([Validator.required, Validator.minPasswordLength])}
            />
            <Link className={styles.forgot} href={'/password'}><p className={styles.subTitle}>Забыли пароль?</p> Восстановить</Link>
            <Button className={styles.submitButton} type='button' onClick={()=>formik.submitForm()}><span>Войти</span></Button>
          </Form>
        </FormikProvider>
      </div>
    </div>
  )
}