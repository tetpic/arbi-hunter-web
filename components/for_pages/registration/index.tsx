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
import DropDownInput from '../../fields/LocationDropdownInput'
import BackBtn from 'components/ui/BackBtn'
import { useResize } from 'components/hooks/useResize'
import { useRouter } from 'next/navigation'
import { ModalType, SnackbarType } from 'types/enums'
import { useUserContext } from 'context/user_state'
import { useAppContext } from 'context/state'
import FormErrorScroll from 'components/ui/FormErrorScroll'
import Button from 'components/ui/Button'
import PasswordField from 'components/fields/PasswordField'
import UserRegImage from 'components/ui/UserRegImage'
import ProgressBar from 'components/ui/ProgressBar'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import { IRegistrationModalProps } from 'components/modals/RegistrationModal'




export default function Registration() {
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()

  const [cityId, setCityId] = useState<number>()
  const [cityNameValue, setCityNameValue] = useState<string|undefined>(undefined) 
  const [country, setCountry] = useState<ISearchCountryResult>()
  const [progress, setProgress] = useState<number>(1)

  const [disableButton, setDisableButton] = useState<boolean>(false)
  const router = useRouter()
  const stepsCount = 3


  const initialValues: IRegistrationComplete = {
    firstName: '',
    lastName: '',
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
    if(!cityId || !country) {
      appContext.showSnackbar('Выберите страну и город из списка', SnackbarType.error)
      return
    }
    else {
      setDisableButton(true)
      data = {...data, 
        cityId, 
        countryId : country.geoname.geonameid,
        phone: userContext.user?.phone,
        profileType: userContext.profileType
      }
      
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

  const  nextPageValidator = (page?: number) => {
    const setErr = (val: string, err?: string) => {
      formik.setFieldTouched(val, true).then(_=>{
        formik.setFieldError(val, err||' ')
      })
    }
    switch(page||progress) {
      case 1: (async() => {
        const values = ['email', 'password', 'phone']
        const errors = await Promise.all(values.map(v=>formik.validateField(v).then(r=> [v, r] as [string, string])))
        const filteredErrors = errors.filter(el=> el[1] !== undefined)
        filteredErrors.forEach(e=> e && setErr(e[0], e[1]))
        if(filteredErrors.length === 0) {
          appContext.showModal<IRegistrationModalProps>(ModalType.RegistrationModal, {
            phone: formik.values.phone,
            onComplete: () => {
              setProgress(page||progress+1)
            }
          })
        }
      })()
      break
      case 2:(async() => {   
        const values = ['firstName', 'lastName', 'telegramNickname']
        const errors = await Promise.all(values.map(v=>formik.validateField(v).then(r=> [v, r] as [string, string])))
        const filteredErrors = errors.filter(el=> el[1] !== undefined)
        filteredErrors.forEach(e=> e && setErr(e[0], e[1]))
        filteredErrors.length === 0 && setProgress(page||progress+1)
      })()
      break
      case 3:(async() => {
        const values = ['cityId', 'countryId']
        const errors = await Promise.all(values.map(v=>formik.validateField(v).then(r=> [v, r] as [string, string])))
        const filteredErrors = errors.filter(el=> el[1] !== undefined)
        filteredErrors.forEach(e=> e && setErr(e[0], e[1]))
        filteredErrors.length === 0 && submit(formik.values)
      })()
    }
  }

  const stage1 = (<>
    <InputField   
    label={'E-mail:'}
    className={styles.input} 
    labelType='top' 
    styleType={'default'} 
    color={'default'} 
    name={'email'} 
    validate={Validator.combine([Validator.required, Validator.email])}
    />

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

    <PasswordField label={'Пароль:'} name={'password'} className={styles.input} />
    </>
  )

  const stage2 =(<>
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
    label={'Telegram:'}
    className={styles.input} 
    labelType='top' 
    styleType={'default'} 
    color={'default'} 
    name={'telegramNickname'} 
    validate={Validator.required}
    />
  </>)

  const stage3 = (<>
    {userContext.profileType === ProfileType.Hirer &&
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

    <DropDownInput 
    onSetOption={countryHandler} 
    name={'countryId'} 
    labelName={'Страна: '}
    requestFn={LocationRepository.searchCountry}
    className={styles.dropInput}
    />

    <DropDownInput 
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
        <ProgressBar fullWidth progress={progress} pointsCount={stepsCount}/>

        <FormikProvider value={formik} >
          <Form className={styles.form} autoComplete={'false'} >
            <FormErrorScroll formik={formik} />
            {progress === 1 && stage1}
            {progress === 2 && stage2}
            {progress === 3 && stage3}
          {progress === 3 &&
            <Button disabled={disableButton} className={styles.submitButton} type='button' onClick={()=> formik.submitForm()}>
              Зарегистрироваться
            </Button>
            ||
            <Button className={styles.submitButton} type='button' onClick={()=> nextPageValidator()}>Продолжить</Button>
          }
          </Form>
        </FormikProvider>
        
      </div>
    </div>
  )
}