import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import background from '../../../images/regModalBack.webp'
import Image from 'next/image'
import ArbiLogoSvg from 'components/svg/ArbiLogoSvg'
import ArbiLogoTextSvg from 'components/svg/ArbiLogoTextSvg'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import { Form, FormikProvider, useField, useFormik } from 'formik'
import { IRegistrationPhone } from 'data/interfaces/IRegistration'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAppContext } from 'context/state'
import { SnackbarType } from 'types/enums'
import RegistrationRepository from 'data/repositories/RegistrationRepository'
import Validator from 'utils/Validator'
import { useAuthContext } from 'context/auth_state'
import OtpCodeField from 'components/fields/OtpCodeField'
import classNames from 'classnames'
import Formatter from 'utils/formatter'
import Button from 'components/ui/Button'

interface Props {
}

enum RegPages {
  Phone='phone',
  Code='code'
}

export default function RegistrationModal(props: Props) {
  const appContext = useAppContext()
  const authContext = useAuthContext()


  const [page, setPage] = useState<RegPages>(RegPages.Phone)
  const [loading, setLoading] = useState<boolean>(false)
  const [seconds, setSeconds] = useState<number>(0)

  //TODO: для разработки,удалить при деплое
  const [code, setCode] = useState<string>('')

  const submit = async(data: IRegistrationPhone) => {
    setLoading(true)
    authContext.confirmCode(data.phone, data.code).then(res=>{
      setLoading(false)
      if(res === false) {
        authContext.showOtpError(true, 'Введите правильный код')
      }
    })
  }

  const formik = useFormik<IRegistrationPhone>({
    initialValues: {
      phone: '',
      code: ''
    },
    onSubmit: submit
  })

  //TODO: перенести запрос в контекст user
  const nextHandler = () => {    
    if(formik.values.phone.length < 10) {
      appContext.showSnackbar('Укажите телефон полностью', SnackbarType.error)
    } else {
      RegistrationRepository.sendSmsCode({phone: formik.values.phone}).then(res=> {        
        setCode(res.code)
        setLoading(false)
        setSeconds(res.codeCanRetryIn)
      })
      page===RegPages.Phone&&setPage(RegPages.Code)
    }
  }

  useEffect(() => {
    if (seconds > 0) {
      const timeoutId = setTimeout(() => setSeconds(seconds - 1), 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [seconds])

  const header = (
    <div className={styles.header}>
      <ArbiLogoSvg/>
      <ArbiLogoTextSvg/>
    </div>
  )

  const phoneField = (<>
  <div className={styles.phoneField}>
    <p className={styles.title}>Регистрация</p>
    <PhoneCountryField 
    styleType={'horizontal'} 
    disabled={false} 
    placeholder={'000 000 00 00'} 
    name={'phone'}  
    inputClassName={styles.input} 
    defaultCountry={'RU'}
    label={'Телефон:'}
    />
    <p className={styles.disclaimer}>
      Продолжая регистрацию на&nbsp;сайте любыми доступными способами, 
      вы&nbsp;подтверждаете, что ознакомлены 
      и&nbsp;полностью согласны с&nbsp;условиями 
      использования сайта.    
    </p>
    <Button className={styles.nextButton} onClick={nextHandler} spinner={loading}>Продолжить</Button>
    {/* <button className={styles.nextButton} type='button' onClick={nextHandler}>Продолжить</button> */}
    <p className={styles.haveAccount}>Уже есть аккаунт? <Link className={styles.haveAccount_link} onClick={appContext.hideModal} href={'/login'}>Войти</Link></p>
  </div>
  </>)


  const codeField = (<>
  <p className={styles.confirmTitle}>Введите код из смс. Мы отправили его на номер {Formatter.hideSomePhoneNumbers(Formatter.formatPhone(formik.values.phone))}</p>
    <OtpCodeField
    name='code'
    length={4}
    validate={Validator.required}
    snackbar={authContext.otpError?.show}
    disabled={authContext.confirmSpinner}
    />
  {seconds === 0 
    ? <p className={styles.refreshCode} onClick={nextHandler}>Отправить код повторно</p>
    : <p className={styles.timeRemain}>Отправить еще код через {Formatter.formatSecondtToTime(seconds)}</p>
  }
  <div className={styles.buttonsWrapper}>
    <Button 
    className={classNames(styles.navButton, styles.navButton_black)} 
    type={'button'} 
    onClick={()=>setPage(RegPages.Phone)}
    >
      Назад
    </Button>

    <Button
    className={classNames(styles.navButton, styles.navButton_yellow)} 
    type={'button'} 
    onClick={()=>formik.submitForm()}
    spinner={loading}
    >
      Далее
    </Button>
  </div>
  <p className={styles.confirmTitle}>{code}</p>
  </>)

  const body = (<div className={styles.body}>
    <FormikProvider value={formik}>
      <Form>
      <>
        {page === RegPages.Phone && phoneField}
        {page === RegPages.Code && codeField}
      </>
      </Form>
    </FormikProvider>
  </div>)

  return ( 
    <ModalLayout fixed className={styles.modalRoot}>
      <Image src={background} alt={'modalBack'} className={styles.background} />
      {header}
      {body}
    </ModalLayout>
  )
}