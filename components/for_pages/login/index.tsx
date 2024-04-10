import styles from './index.module.scss'

import { runtimeConfig} from 'config/runtimeConfig'
import InputField from 'components/fields/InputField'
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
import { LoginType, ModalType, SnackbarType } from 'types/enums'
import Validator from 'utils/Validator'
import Button from 'components/ui/Button'
import UserRegImage from 'components/ui/UserRegImage'
import useTranslation from 'next-translate/useTranslation'
import { AlertModalArgs } from '@/components/modals/AlertModal'



export default function Login() {
  const { HOST } = runtimeConfig

  const router = useRouter()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const {t} = useTranslation()

  const [loginType, setLoginType] = useState<LoginType>(LoginType.Email)
  const [passwordIsOpen, setPasswordOpen] = useState<boolean>(false)

  const passwordHandler = () => {
    setPasswordOpen(!passwordIsOpen)
  }

  const showInfo = () => {
    appContext.showModal<AlertModalArgs>(ModalType.AlertModal, {
      text: <>Всем привет! <br /> 
      Мы решили еще немного улучшить нашу платформу, чтобы вы смогли на 100% оценить качество и функционал, 
      следите за новостями в телеграм группе &ldquo;ArbiHunter&rdquo;, чтобы не пропустить дату открытия регистрации ;)
      </>,
      onClick: ()=>{appContext.hideModal()}
    })
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
        errString = t('login_wrongPassword')
      }
      else if(err.message === 'Network Error') {
        errString = t('login_connectionLost')
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

  // const googleLogin = () => {
  //   router.push(HOST +'/api/auth/google/login')
  // }

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
          {t('login')}
        </p>
        <p className={styles.subTitle}>
          {t('login_stillNoAccount')}
          <div className={styles.loginLink} onClick={showInfo}>
            {t('login_getRegister')}
          </div>
        </p>
        <FormikProvider value={formik}>
          <Form onKeyDown={e=>onInputEnterPress(e)} className={styles.form}>
            {loginType=== LoginType.Email &&
              <InputField   
              inputMode='email'
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
            <InputField 
            label={`${t('password')}:`}
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
            
            <Link className={styles.forgot} href={'/password'}><p className={styles.subTitle}>{t('login_forgot')}</p> {t('login_restorePassword')}</Link>
            
            <div className={styles.buttonsWrapper}>
              <Button 
              type='button' 
              styleType={[ 'gradient','phoneWide']}
              onClick={()=>formik.submitForm()}>
                <span>{t('enter')}</span>
              </Button>
              
              {/* <Button 
              type='button' 
              onClick={googleLogin} 
              styleType={['black', 'phoneWide']}
             
              icon={
                <Image src={'/images/companyLogos/googleLogo.png'} alt={'google'} width={24} height={24} />
              }>
                {t('login_viaGoogle')}
              </Button> */}
            </div>

          </Form>
        </FormikProvider>
      </div>
    </div>
  )
}