import styles from './index.module.scss'

import { useState } from 'react'
import { useAppContext } from 'context/state'
import UserRegImage from 'components/ui/UserRegImage'
import { useUserContext } from 'context/user_state'
import BackBtn from 'components/ui/BackBtn'
import { useRouter } from 'next/navigation'
import PhoneOrEmail from './PhoneOrEmail'
import PasswordConfirm from './PasswordConfirm'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import { Form, FormikProvider, useFormik } from 'formik'
import { IRegistrationModalProps } from '@/components/modals/RegistrationModal'
import { ModalType } from 'types/enums'

interface Props {
}

export interface RestoreFields {
  newPassword: string,
  newPasswordRepeat: string
  email: string
}

export default function Password(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const userContext = useUserContext()
  const router = useRouter()
  const {isTabletWidth} = appContext.size
  const [step, setStep] = useState<number>(1)

  const onSubmitHandler = () => {
    setStep(2)
  }

  const submit = (data: RestoreFields) => {
    appContext.showModal<IRegistrationModalProps>(ModalType.RegistrationModal, {
      email: formik.values.email,
      newPassword: formik.values.newPassword,
      needRestore: true,
      onComplete: () => {
        setTimeout(() => {
          router.replace('/')
        }, 1000)
      }
    })
  }

  const formik = useFormik<RestoreFields>({
    initialValues: {
      email: '',
      newPassword: '',
      newPasswordRepeat: ''
    },
    onSubmit: submit
  })


  return (
  <div className={styles.root}> 
    {!isTabletWidth&& 
      <UserRegImage type={userContext.profileType} className={styles.regImage}/>
    }
    <FormikProvider value={formik}>
      <Form className={styles.content}>
        <P useThemeColor className={styles.title}>
        {isTabletWidth&&<BackBtn onClick={()=>{router.back()}} />}
        {t('login_restoringPassword')}
        </P>
        {step === 1 &&
        <PhoneOrEmail onComplete={onSubmitHandler}/>
        }
        {step === 2 &&
          <PasswordConfirm onComplete={formik.submitForm}/> 
        }
      </Form>
    </FormikProvider>
  </div>)
}