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
import UserRegImage from 'components/ui/UserRegImage'
import BackBtn from 'components/ui/BackBtn'
import { useResize } from 'components/hooks/useResize'
import { useRouter } from 'next/router'
import { ModalType, SnackbarType } from 'types/enums'
import { useUserContext } from 'context/user_state'
import { useAppContext } from 'context/state'
import FormErrorScroll from 'components/ui/FormErrorScroll'
import Button from 'components/ui/Button'
import PasswordField from 'components/fields/PasswordField'




export default function Registration() {

  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()

  const [cityId, setCityId] = useState<number>()
  const [cityNameValue, setCityNameValue] = useState<string|undefined>(undefined) 
  const [country, setCountry] = useState<ISearchCountryResult>()
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const initialValues: IRegistrationComplete = {
    firstName: '',
    lastName: '',
    password: '',       
    profileType: userContext.profileType??ProfileType.Employee,
    telegramNickname: '',
    email: '',
    countryId: undefined,
    cityId: undefined,
  }

  const submit = async (data: IRegistrationComplete) => {
    if(!cityId || !country) {
      appContext.showSnackbar('Выберите страну и город из списка', SnackbarType.error)
    }
    else {
      data = {...data, 
        cityId, 
        countryId : country.geoname.geonameid,
        phone: userContext.user?.phone,
        profileType: userContext.profileType
      }
      
      RegistrationRepository.completeRegistration(data)
      .then(res=> {
        router.push('/') 
      })
      .catch(err=> {
        appContext.showSnackbar(err.toString(), SnackbarType.error)
        return
      })
    }
  }

  
  if(userContext.profileType === ProfileType.Hirer) {
    initialValues.company = ''
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: submit
  })

  const countryHandler = (obj: ISearchCountryResult) => {
    setCountry(obj)
    setCityNameValue('')
  }

  const cityHandler = (obj: ISearchCityResult) =>  {
    setCityId(obj.id)
  }

  useEffect(()=>{
    if(!userContext.isLogged) {
      appContext.showModal(ModalType.RegistrationModal)
    }
    else {
      // router.replace('/')
    }
    return ()=> appContext.hideModal()
  }, [userContext.isLogged])

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
        <FormikProvider value={formik} >
          <Form className={styles.form} autoComplete={'false'} >
            <FormErrorScroll formik={formik} />
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
            error={!country?'Выберите страну из списка':undefined}
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
            error={!cityId?'Выберите город из списка':undefined}
            />
            
            <InputField 
            label={'Telegram:'}
            className={styles.input} 
            labelType='top' 
            styleType={'default'} 
            color={'default'} 
            name={'telegramNickname'} 
            />

            {/* <InputField 
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
            /> */}

            <PasswordField label={'Пароль:'} name={'password'} className={styles.input} />

            <InputField   
            label={'E-mail:'}
            className={styles.input} 
            labelType='top' 
            styleType={'default'} 
            color={'default'} 
            name={'email'} 
            validate={Validator.combine([Validator.required, Validator.email])}
            />

          {/* <div className={styles.submitButton} onClick={()=> formik.submitForm()}>Зарегистрироваться</div> */}
          <Button className={styles.submitButton} onClick={()=> formik.submitForm()} spinner={loading}>
            Зарегистрироваться
          </Button>
          </Form>
        </FormikProvider>
        
      </div>
    </div>
  )
}