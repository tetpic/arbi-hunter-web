import styles from './index.module.scss'

import InputField from 'components/fields/InputField'
import { IRegistrationComplete, ProfileType } from 'data/interfaces/IRegistration'
import { Form, FormikProvider, useFormik } from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import Validator from 'utils/Validator'
import { useEffect, useState } from 'react'
import RegistrationRepository from 'data/repositories/RegistrationRepository'
import LocationRepository from 'data/repositories/LocationRepository'
import {ISearchCountryResult, ISearchCityResult} from 'data/interfaces/ILocation'
import LocationDropDownInput from '../../fields/LocationDropdownInput'
import BackBtn from 'components/ui/BackBtn'
import { useRouter } from 'next/navigation'
import { LoginType, ModalType, SnackbarType } from 'types/enums'
import { useUserContext } from 'context/user_state'
import { useAppContext } from 'context/state'
import FormErrorScroll from 'components/ui/FormErrorScroll'
import Button from 'components/ui/Button'
import PasswordField from 'components/fields/PasswordField'
import UserRegImage from 'components/ui/UserRegImage'
import ProgressBar from 'components/ui/ProgressBar'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import { IRegistrationModalProps } from 'components/modals/RegistrationModal'
import Modes from '@/components/ui/Modes'




export default function Registration() {
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  const [cityId, setCityId] = useState<number>(undefined)
  const [cityNameValue, setCityNameValue] = useState<string|undefined>(undefined) 
  const [country, setCountry] = useState<ISearchCountryResult>()
  const [progress, setProgress] = useState<number>(1)
  const [loginType, setLoginType] = useState<LoginType>(LoginType.Phone)


  const [disableButton, setDisableButton] = useState<boolean>(false)
  const router = useRouter()
  const stepsCount = userContext.profileType===ProfileType.Hirer ? 4 : 3


  const initialValues: IRegistrationComplete = {
    firstName: '',
    lastName: '',
    patronymic: '',
    password: '',      
    phone: '', 
    profileType: userContext.profileType??ProfileType.Employee,
    telegramNickname: '',
    email: '',
    countryId: undefined,
    cityId: undefined,
  }
  if(userContext.profileType === ProfileType.Hirer) {
    initialValues.company = ''
  }

  const submit = async (data: IRegistrationComplete) => {
    if((!cityId || !country) && userContext.profileType === ProfileType.Hirer) {
      appContext.showSnackbar('Выберите страну и город из списка', SnackbarType.error)
      return
    }
    else {
      setDisableButton(true)
      data = {...data, 
        cityId, 
        countryId : country?.geoname?.geonameid,
        phone: userContext.user?.phone||data.phone,
        profileType: userContext.profileType
      }
      !data.telegramNickname && delete data.telegramNickname
      !data.cityId && delete data.cityId
      !data.countryId && delete data.countryId
      RegistrationRepository.completeRegistration(data)
      .then(res=> {
        setTimeout(() => {          
          userContext.updateUser()
        }, 300)
      })
      .catch(err=> {
        setDisableButton(false)
        appContext.showSnackbar('Такой email уже есть в системе', SnackbarType.error)
        return
      })
    }
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: submit
  })

  const countryHandler = (obj: ISearchCountryResult) => {
    setCountry(obj)
    setCityNameValue('')
    formik.setFieldValue('cityId', '')
  }

  const cityHandler = (obj: ISearchCityResult) =>  {
    setCityId(obj.id)
  }

  const changeLoginTypeHandler = (s: LoginType) => {
    setLoginType(s)
    formik.resetForm()
  }

  const  nextPageValidator = (page?: number) => {
    const setErr = (val: string, err?: string) => {
      formik.setFieldTouched(val, true).then(_=>{
        formik.setFieldError(val, err||' ')
      })
    }

    const validateValues = async(strArr: string[]):Promise<boolean> => {
      const errors = await Promise.all(strArr.map(v=>formik.validateField(v).then(r=> [v, r] as [string, string])))
      const filteredErrors = errors.filter(el=> el[1] !== undefined)
      filteredErrors.forEach(e=> e && setErr(e[0], e[1]))
      if(filteredErrors.length > 0) return false
      else return true
      // filteredErrors.length === 0 && setProgress(page||progress+1)
    }

    switch(page||progress) {
      case 1: (async() => {
        const values = loginType === LoginType.Phone ? ['phone', 'password'] : ['email', 'password']
        const errors = await Promise.all(values.map(v=>formik.validateField(v).then(r=> [v, r] as [string, string])))
        const isLoginExist = await RegistrationRepository.checkEmailOrPhoneExists(formik.values[loginType])
        const filteredErrors = errors.filter(el=> el[1] !== undefined)
        filteredErrors.forEach(e=> e && setErr(e[0], e[1]))
        
        if(filteredErrors.length === 0 && (!isLoginExist.exists ||(!isLoginExist.isRegistrationCompleted && isLoginExist.profilesCount === 0))) {
          appContext.showModal<IRegistrationModalProps>(ModalType.RegistrationModal, {
            [loginType]: formik.values[loginType],
            onComplete: () => {
              setProgress(page||progress+1)
            }
          })
        }
        else {
          setErr(loginType, `Такой ${loginType === 'email' ? 'email' : 'телефон'} уже есть в системе`)
          // formik.setFieldError(loginType, `Такой ${loginType === 'email' ? 'email' : 'телефон'} уже есть в системе`)
          // formik.setFieldTouched(loginType, true)
          // appContext.showSnackbar(`Такой ${loginType === 'email' ? 'email' : 'телефон'} уже есть в системе`, SnackbarType.error)
        }
      })()
      break
      case 2:(async() => {  
        const values = loginType === LoginType.Phone? ['email'] : ['phone']
        validateValues(values)
        .then(res=> {
          
          if(res === false) {
            setErr(loginType, `Введите корректный ${loginType === 'email' ? 'email' : 'номер'}`)
          }
          else {
            RegistrationRepository.checkEmailOrPhoneExists(loginType === 'email' ? formik.values.phone : formik.values.email)
            .then(r=> {
              if(r.exists === true) setErr(loginType==='phone' ?'email':'phone', `Такой ${loginType === 'email' ? 'телефон' : 'email'} уже есть в системе`)
              else { setProgress(page||progress+1) }
            })
          }
        })
      })()
      break
      case 3:(() => {   
        const values = ['firstName', 'lastName']
        validateValues(values).then(res=> {
          if(res) setProgress(page||progress+1)
        })
      })()
      break
      case 4:(() => {
        const values = ['cityId', 'countryId']
        validateValues(values)
      })()
    }
  }

  const stage1 = (<>

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

    {loginType===LoginType.Phone && 
      <PhoneCountryField 
      styleType={'horizontal'} 
      disabled={false} 
      placeholder={'000 000 00 00'} 
      name={'phone'}  
      className={styles.input} 
      defaultCountry={'RU'}
      label={'Телефон:'}
      validate={Validator.phone}
      />
      ||
      <InputField   
      label={'E-mail:'}
      className={styles.input} 
      labelType='top' 
      styleType={'default'} 
      color={'default'} 
      name={'email'} 
      validate={Validator.combine([Validator.required, Validator.email])}
      />
    }

    <PasswordField label={'Пароль:'} name={'password'} className={styles.input} />
    </>
  )

  const stage2 = (<>
    <p className={styles.uneditable}>
      {loginType === LoginType.Phone ? `Телефон: ${formik.values.phone}` : `E-mail: ${formik.values.email}`}
    </p>
   {loginType === LoginType.Phone && 
    <InputField   
    label={'E-mail:'}
    className={styles.input} 
    labelType='top' 
    styleType={'default'} 
    color={'default'} 
    name={'email'} 
    validate={Validator.combine([Validator.required, Validator.email])}
    />
    ||
    <PhoneCountryField 
    styleType={'horizontal'} 
    disabled={false} 
    placeholder={'000 000 00 00'} 
    name={'phone'}  
    className={styles.input} 
    defaultCountry={'RU'}
    label={'Телефон:'}
    validate={Validator.phone}
    />   
   }
  
  </>)

  const stage3 =(<>
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

    <InputField 
    label={'Отчество:'}
    className={styles.input} 
    labelType='top' 
    styleType={'default'} 
    color={'default'} 
    name={'patronymic'} 
    />

    <InputField 
    label={'Telegram:'}
    className={styles.input} 
    labelType='top' 
    styleType={'default'} 
    color={'default'} 
    name={'telegramNickname'} 
    />
  </>)

  const stage4 = (<>
    <InputField 
    label={'Название компании:'}
    className={styles.input} 
    labelType='top' 
    styleType={'default'} 
    color={'default'} 
    name={'company'} 
    validate={Validator.required}
    />

    <LocationDropDownInput 
    onSetOption={countryHandler} 
    name={'countryId'} 
    labelName={'Страна: '}
    requestFn={LocationRepository.searchCountry}
    className={styles.dropInput}
    />

    <LocationDropDownInput 
    onSetOption={cityHandler} 
    name={'cityId'} 
    labelName={'Город: '}
    requestFn={LocationRepository.searchCity}
    country={country&&country.country_code}
    value={cityNameValue}
    onChange={(s: string) => {setCityNameValue(s)}}
    className={styles.dropInput}
    />
  </>)

  useEffect(()=>{
    if(userContext.currentProfile) {
      setTimeout(()=>{
        router.push('/')
      }, 100)
    }
  }, [userContext.currentProfile])

  useEffect(()=>{
    setProgress(1)
    formik.resetForm()
  }, [userContext.profileType])

  useEffect(()=>{
    isTabletWidth && appContext.showModal(ModalType.ProfileTypeSwitcher)
  }, [])


  return ( 
    <div className={styles.root}>
      {!isTabletWidth&& 
        <UserRegImage type={userContext.profileType} className={styles.regImage}/>
      }
      <div className={styles.content}>
        <p className={styles.title}>
          {isTabletWidth&&<BackBtn onClick={()=>{router.back()}} bgColor={'white'}/>}
          Регистрация 
          {!isTabletWidth&&<Image src={'/icons/scribe.png'} width={'24'} height={'24'} alt={'scribeIcon'}/>}
        </p>
        <p className={styles.subTitle}>
          Уже есть аккаунт? 
          <Link className={styles.loginLink} href={'/login'}>Войти</Link>
        </p>
        {progress > 1 &&
        <ProgressBar fullWidth progress={progress} pointsCount={stepsCount}/>
        }

        <FormikProvider value={formik} >
          <Form className={styles.form} autoComplete={'false'} >
            <FormErrorScroll formik={formik} />
            {progress === 1 && stage1}
            {progress === 2 && stage2}
            {progress === 3 && stage3}
            {progress === 4 && stage4}

            <div className={styles.buttons}>
              {((userContext.profileType ===ProfileType.Employee &&progress <= 3)||(userContext.profileType ===ProfileType.Hirer &&progress <= 4)) && progress > 2 &&
                <Button className={styles.submitButton} type='button' onClick={()=> nextPageValidator(progress - 1)}>Назад</Button>
              }
              {((userContext.profileType ===ProfileType.Employee &&progress === 3)||(userContext.profileType ===ProfileType.Hirer &&progress === 4)) &&
                <Button title={'register'} disabled={disableButton} className={styles.submitButton} type='button' onClick={()=> formik.submitForm()}>
                  Зарегистрироваться
                </Button>
                ||
                <Button title="next" className={styles.submitButton} type='button' onClick={()=> nextPageValidator()}>Продолжить</Button>
              }
            </div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  )
}