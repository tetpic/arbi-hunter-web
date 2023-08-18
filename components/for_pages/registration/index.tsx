import styles from './index.module.scss'
import InputField from 'components/fields/InputField'
import BigHomeSvg from 'components/svg/BigHomeSvg'
import { useAppContext } from 'context/state'
import { IRegistrationComplete, ProfileType } from 'data/interfaces/IRegistration'
import { Form, FormikProvider, useFormik } from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import Validator from 'utils/Validator'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import { useState } from 'react'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import CityInput from './CityInput'
import CountryInput from './CountryInput'
import RegistrationRepository from 'data/repository/RegistrationRepository'

interface Props {
}

export default function Registration(props: Props) {

  const appContext = useAppContext()

  const [cityId, setCityId] = useState<number>()
  const [countryId, setCountryId] = useState<number>()

  const submit = async (data: IRegistrationComplete) => {

    data = {...data, cityId, countryId}
    debugger
    if(!cityId || !countryId) {
      //тут показать snackbar или ошибку под инпутом
    }
    RegistrationRepository.completeRegistration(data)
    .then(res=> {
      debugger
    })
    .catch(err=> {
      debugger
    })
    

  }

  const [passwordIsOpen, setPasswordOpen] = useState<boolean>(false)

  const passwordHandler = () => {
    debugger
    setPasswordOpen(!passwordIsOpen)
  }

  const initialValues: IRegistrationComplete = {
    firstName: '',
    lastName: '',
    password: '',    
    profileType: appContext.profileType??ProfileType.Employee,
    telegramNickname: '',
    phone: '',
    email: '',
  }

  if(appContext.profileType === ProfileType.Hirer) {
    initialValues.company = ''
  }



  const formik = useFormik<IRegistrationComplete>({
    initialValues: initialValues,
    onSubmit: submit
  })
  


  return ( 
    <div className={styles.root}>
      <div className={styles.svgWrapper}>
        <BigHomeSvg className={styles.svg}/>
      </div>
      <div className={styles.content}>
        <p className={styles.title}>Регистрация <Image src={'/icons/scribe.png'} width={'24'} height={'24'} alt={'scribeIcon'}/></p>
        <p className={styles.subTitle}>
          Уже есть аккаунт? 
          <Link className={styles.loginLink} href={'/login'}>Войти</Link>
        </p>
        <FormikProvider value={formik} >
          <Form className={styles.form} >

            <InputField 
            label={'Имя:'}
            className={styles.input} 
            labelType='top' 
            styleType={'default'} 
            color={'default'} 
            name={'firstName'} 
            validate={Validator.combine([Validator.required, Validator.onlyChars])}
            />

            <InputField 
            label={'Фамилия:'}
            className={styles.input} 
            labelType='top' 
            styleType={'default'} 
            color={'default'} 
            name={'lastName'} 
            validate={Validator.combine([Validator.required, Validator.onlyChars])}
            />

            {appContext.profileType === ProfileType.Hirer &&
              <InputField 
              label={'Название компании:'}
              className={styles.input} 
              labelType='top' 
              styleType={'default'} 
              color={'default'} 
              name={'company'} 
              validate={Validator.required}
              />
            }

            <CountryInput 
            onSetOption={setCountryId} 
            name={'countryId'} 
            />

            <CityInput 
            onSetOption={setCityId} 
            name={'cityId'}
            />

            <PhoneCountryField 
            styleType={'horizontal'} 
            disabled={false} placeholder={'000 000 00 00'} 
            name={'phone'}  
            inputClassName={styles.input} 
            defaultCountry={'RU'}
            label={'Телефон:'}
            />
            
            <InputField 
            label={'Telegram:'}
            className={styles.input} 
            labelType='top' 
            styleType={'default'} 
            color={'default'} 
            name={'telegramNickname'} 
            />

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

            <InputField   
            label={'E-mail:'}
            className={styles.input} 
            labelType='top' 
            styleType={'default'} 
            color={'default'} 
            name={'email'} 
            validate={Validator.combine([Validator.required, Validator.email])}
            />

          <div className={styles.submitButton} onClick={()=> formik.submitForm()}>Зарегистрироваться</div>
          </Form>
        </FormikProvider>
        
      </div>
    </div>
  )
}