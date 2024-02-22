import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import { Form, FormikProvider, useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useAppContext } from 'context/state'
import RegistrationRepository from 'data/repositories/RegistrationRepository'
import Validator from 'utils/Validator'
import { useAuthContext } from 'context/auth_state'
import OtpCodeField from 'components/fields/OtpCodeField'
import classNames from 'classnames'
import Formatter from 'utils/formatter'
import Button from 'components/ui/Button'
import { IRegistrationData } from 'data/interfaces/IRegistration'
import useAbortController from 'components/hooks/useAbortController'

interface Props {
  onClose?: () => void

}

enum RegPages {
  Code='code'
}

export interface IRegistrationModalProps {
  onComplete?: () => void
  phone?: string,
  email?: string
}

export default function RegistrationModal(props: Props) {
  const appContext = useAppContext()
  const authContext = useAuthContext()

  const [loading, setLoading] = useState<boolean>(false)
  const [seconds, setSeconds] = useState<number>(0)
  const {getNewSignal} = useAbortController()
  const args:IRegistrationModalProps = appContext.modalArguments

  const [code, setCode] = useState<string>('')

  const submit = async(data: IRegistrationData) => {
    debugger
    if(data.code.length < 4) {
      authContext.showOtpError(true, 'Введите код')
      return
    }
    setLoading(true)
    authContext.confirmCode({phone: args.phone, code: data.code, email: args.email})
    .then(res=>{
      if(res===false) {
        authContext.showOtpError(true, 'Введите правильный код')
      }
      else {
        args.onComplete()
        appContext.hideModal()
      }
      setLoading(false)
    })
    .catch(err=>{
      authContext.showOtpError(true, 'Введите правильный код')
    })
  }

  const formik = useFormik<IRegistrationData>({
    initialValues: {
      code: ''
    },
    onSubmit: submit
  })

  useEffect(() => {
    if (seconds > 0) {
      const timeoutId = setTimeout(() => setSeconds(seconds - 1), 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [seconds])

  useEffect(()=>{
    if(!code) {
      const [signal, controller] = getNewSignal('getSmsCode')
      args.phone&&RegistrationRepository.sendSmsCode({phone: args.phone}, {signal}).then(res=> {        
        setCode(res.code)
        setLoading(false)
        setSeconds(res.codeCanRetryIn)
      })
      .catch(err=> {
      })
      args.email&&RegistrationRepository.sendEmailCode({email: args.email}, {signal}).then(res=> {        
        setCode(res.code)
        setLoading(false)
        setSeconds(res.codeCanRetryIn)
      })
      .catch(err=> {
      })
    }
  }, [args.phone, args.email])



  const codeField = (<>
    <p className={styles.confirmTitle}>Отправили код на {args.phone?'номер':'e-mail'} <br /> 
    {args.phone&&Formatter.formatPhone(args.phone)||args.email}
    </p>
    <p className={styles.disclaimer}>
      Введите его, чтобы мы убедились что <br />
      это вы, а не кто-то другой
    </p>

    <OtpCodeField
    name='code'
    length={4}
    onComplete={()=>formik.submitForm()}
    validate={Validator.required}
    snackbar={authContext.otpError?.show}
    disabled={authContext.confirmSpinner}
    />

  <div className={styles.buttonsWrapper}>
    {/* <Button
    className={classNames(styles.navButton, styles.navButton_yellow)} 
    type={'button'} 
    onClick={()=>authContext.showOtpError(true, 'Введите правильный код')  }
    spinner={loading}
    >
      Продолжить
    </Button> */}
    <Button 
    onClick={props.onClose}
    className={classNames(styles.navButton, styles.navButton_black)} 
    type={'button'} 
    >
      Отменить
    </Button>
  </div>
  {seconds === 0 
    ? <p className={styles.refreshCode} >Отправить код повторно</p>
    : <p className={styles.timeRemain}>Повторить через {Formatter.formatSecondsToTime(seconds)}</p>
  }
  <p className={styles.confirmTitle}>{code}</p>
  </>)

  const body = (<div className={styles.body}>
    <FormikProvider value={formik}>
      <Form>
        {codeField}
      </Form>
    </FormikProvider>
  </div>)

  return ( 
    <ModalLayout fixed className={styles.modalRoot}>
      {body}
    </ModalLayout>
  )
}