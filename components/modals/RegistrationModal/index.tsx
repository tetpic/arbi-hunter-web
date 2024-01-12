import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import { Form, FormikProvider, useFormik } from 'formik'
import { IRegistrationPhone } from 'data/interfaces/IRegistration'
import { useEffect, useState } from 'react'
import { useAppContext } from 'context/state'
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
  Code='code'
}

export interface IRegistrationModalProps {
  onComplete?: () => void
  phone?: string
}

export default function RegistrationModal(props: Props) {
  const appContext = useAppContext()
  const authContext = useAuthContext()

  const [loading, setLoading] = useState<boolean>(false)
  const [seconds, setSeconds] = useState<number>(0)
  const args:IRegistrationModalProps = appContext.modalArguments

  const [code, setCode] = useState<string>('')

  const submit = async(data: IRegistrationPhone) => {
    setLoading(true)
    authContext.confirmCode(args.phone, data.code)
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

  const formik = useFormik<IRegistrationPhone>({
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
      RegistrationRepository.sendSmsCode({phone: args.phone}).then(res=> {        
        setCode(res.code)
        setLoading(false)
        setSeconds(res.codeCanRetryIn)
      })
    }
  }, [args.phone])



  const codeField = (<>
    <p className={styles.confirmTitle}>Отправили код на номер <br /> 
    {Formatter.formatPhone(args.phone)}
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
    <Button
    className={classNames(styles.navButton, styles.navButton_yellow)} 
    type={'button'} 
    onClick={()=>formik.submitForm()}
    spinner={loading}
    >
      Продолжить
    </Button>
    <Button 
    className={classNames(styles.navButton, styles.navButton_black)} 
    type={'button'} 
    >
      Отменить
    </Button>
  </div>
  {seconds === 0 
    ? <p className={styles.refreshCode} >Отправить код повторно</p>
    : <p className={styles.timeRemain}>Повторить через {Formatter.formatSecondtToTime(seconds)}</p>
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