import { useState } from 'react'
import styles from './index.module.scss'
import { LoginType } from 'types/enums'
import { ILogin } from 'data/interfaces/IRegistration'
import { Form, FormikProvider, useFormik } from 'formik'
import { useAppContext } from 'context/state'
import UserRegImage from 'components/ui/UserRegImage'
import { useUserContext } from 'context/user_state'
import BackBtn from 'components/ui/BackBtn'
import { useRouter } from 'next/navigation'
import Modes from 'components/ui/Modes'
import InputField from 'components/fields/InputField'
import Validator from 'utils/Validator'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import Button from 'components/ui/Button'

interface Props {
}

export default function Password(props: Props) {
  const [loginType, setLoginType] = useState<LoginType>(LoginType.Phone)
  const appContext = useAppContext()
  const userContext = useUserContext()
  const router = useRouter()


  const {isTabletWidth} = appContext.size


  const initialValues: ILogin = {
    login: '',
  }

  const submit = (data : ILogin) => {  
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: submit
  })

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

  const changeLoginTypeHandler = (s: LoginType) => {
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
      Восстановление пароля
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
          <Button className={styles.submitButton} type='button' onClick={()=>formik.submitForm()}><span>Восстановить</span></Button>
        </Form>
      </FormikProvider>
    </div>
  </div>)
}