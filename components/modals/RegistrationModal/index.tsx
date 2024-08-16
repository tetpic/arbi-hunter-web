import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import { Form, FormikProvider, useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useAppContext } from 'context/state'
import RegistrationRepository from 'data/repositories/RegistrationRepository'
import Validator from 'utils/Validator'
import { useAuthContext } from 'context/auth_state'
import OtpCodeField from 'components/fields/OtpCodeField'
import Formatter from 'utils/formatter'
import Button from 'components/ui/Button'
import { IRegistrationData } from 'data/interfaces/IRegistration'
import useAbortController from 'components/hooks/useAbortController'
import ModalBody from '@/components/layout/Modal/ModalBody'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'

interface Props {
  onClose?: () => void

}

enum RegPages {
  Code='code'
}

export interface IRegistrationModalProps {
  onComplete?: (code?: string, token?: string) => void
  phone?: string,
  email?: string,
  newPassword?: string
  needRestore?: boolean
}

export default function RegistrationModal(props: Props) {
  const appContext = useAppContext()
  const authContext = useAuthContext()
  const {t} = useTranslation()

  const [loading, setLoading] = useState<boolean>(false)
  const [seconds, setSeconds] = useState<number>(0)
  const {getNewSignal} = useAbortController()
  const args:IRegistrationModalProps = appContext.modalArguments

  const [code, setCode] = useState<string>('')

  const submit = async(data: IRegistrationData) => {
    if(data.code.length < 4) {
      authContext.showOtpError(true, t('registration_enterCode'))
      return
    }
    setLoading(true)
   
    authContext.confirmCode({phone: args.phone, code: data.code, email: args.email, newPassword: args.newPassword}, args.needRestore)
    .then(res=>{
      if(res===false) {
        authContext.showOtpError(true, t('registration_enterCorrectCode'))
      }
      else {
        args.onComplete()
        appContext.hideModal()
      }
      setLoading(false)
    })
    .catch(err=>{
      // eslint-disable-next-line no-console
      console.warn(err)
      
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
    <P useThemeColor styleType={['fs20', 'w600', 'textCenter']}>{t('registration_sendCodeTo')} {args.phone?t('registration_number'):'e-mail'} <br /> 
    {args.phone&&Formatter.formatPhone(args.phone)||args.email}
    </P>
    <p className={styles.disclaimer}>
      {t('registration_enterDescription1')} <br />
      {t('registration_enterDescription2')}
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
    onClick={props.onClose}
    styleType={['black', 'phoneWide']}
    altStyleType={['white', 'phoneWide']}
    // className={classNames(styles.navButton, styles.navButton_black)} 
    type={'button'} 
    >
      {t('cancel')}
    </Button>
  </div>

  {seconds === 0 
    ? <P styleType={['medium', 'w500', 'textCenter']} useThemeColor className={styles.refreshCode} >{t('registration_sendCodeAgain')}</P>
    : <P styleType={['medium', 'w500', 'textCenter']} useThemeColor className={styles.timeRemain}>{t('registration_repeatAfter')} {Formatter.formatSecondsToTime(seconds)}</P>
  }
  <P styleType={['fs20', 'w600', 'textCenter']} useThemeColor data-cy={'confirmCode'} data-value={code}>{code}</P>
  </>)

  const body = (<div className={styles.body}>
    <FormikProvider value={formik}>
      <Form>
        {codeField}
      </Form>
    </FormikProvider>
  </div>)

  return ( 
    <ModalLayout mobileFullScreen className={styles.modalRoot}>
      <ModalBody >
        {body}
      </ModalBody>
    </ModalLayout>
  )
}