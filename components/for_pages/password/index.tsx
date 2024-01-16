import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import { useAppContext } from 'context/state'
import UserRegImage from 'components/ui/UserRegImage'
import { useUserContext } from 'context/user_state'
import BackBtn from 'components/ui/BackBtn'
import { useRouter } from 'next/navigation'
import PhoneOrEmail from './PhoneOrEmail'
import PasswordConfirm from './PasswordConfirm'
import { SnackbarType } from 'types/enums'

interface Props {
}

export default function Password(props: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const router = useRouter()
  const {isTabletWidth} = appContext.size
  const [step, setStep] = useState<number>(1)

  const onSubmitHandler = () => {
    debugger
    if(userContext.user?.isRegistrationCompleted) {
      setStep(2)
    }
    else {
      appContext.showSnackbar('Аккаунта не существует', SnackbarType.error)
      router.replace('/registration')
    }
  }

  useEffect(()=>{
    if(userContext.user) {
      onSubmitHandler()  
    }
  }, [userContext.user])


  return (
  <div className={styles.root}> 
    {!isTabletWidth&& 
      <UserRegImage type={userContext.profileType} className={styles.regImage}/>
    }
    <div className={styles.content}>
      <p className={styles.title}>
      {isTabletWidth&&<BackBtn onClick={()=>{router.back()}} bgColor={'white'}/>}
      Восстановление пароля
      </p>
      {step === 1 &&
      <PhoneOrEmail/>
      }
      {step === 2 &&
        <PasswordConfirm/> 
      }
    </div>
  </div>)
}