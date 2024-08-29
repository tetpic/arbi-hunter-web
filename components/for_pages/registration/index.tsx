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
import { clearObject } from 'utils/helpers'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import CheckboxField from '@/components/fields/CheckboxField'
import { AppMetricaEvent, sendToMetrika } from 'utils/sendToMetrics'

interface Props {
  token?: string
}

export default function Registration(props: Props) {
  const {t} = useTranslation()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  const [cityId, setCityId] = useState<number>(undefined)
  const [cityNameValue, setCityNameValue] = useState<string|undefined>(undefined)
  const [country, setCountry] = useState<ISearchCountryResult>()
  const [progress, setProgress] = useState<number>(1)


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
    agreement: false
  }
  if(userContext.profileType === ProfileType.Hirer) {
    initialValues.company = ''
  }

  const submit = async (data: IRegistrationComplete) => {

    if((!cityId || !country) && userContext.profileType === ProfileType.Hirer) {
      appContext.showSnackbar(t('registration_chooseCityAndCountry'), SnackbarType.error)
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
      delete data.agreement
      const sendData = clearObject(data)

      RegistrationRepository.completeRegistration(sendData)
      .then(res=> {
        sendToMetrika(AppMetricaEvent.FinishRegistration)
        setTimeout(() => {
          userContext.updateUser()
        }, 300)
      })
      .catch(err=> {
        setDisableButton(false)
        appContext.showSnackbar(t('registration_emailExist'), SnackbarType.error)
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
    // appContext.showModal<AlertModalArgs>(ModalType.AlertModal, {
    //   text: <>Всем привет! <br />
    //   Мы решили еще немного улучшить нашу платформу, чтобы вы смогли на 100% оценить качество и функционал,
    //   следите за новостями в телеграм группе &ldquo;ArbiHunter&rdquo;, чтобы не пропустить дату открытия регистрации ;)
    //   </>,
    //   onClick: ()=>{appContext.hideModal()}
    // })
    // return
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
    }

    switch(page||progress) {
      case 1: (async() => {
        const values = ['email', 'password']
        const errors = await Promise.all(values.map(v=>formik.validateField(v).then(r=> [v, r] as [string, string])))
        const isLoginExist = formik.values.email.length > 0 && await RegistrationRepository.checkEmailOrPhoneExists(formik.values.email)
        const filteredErrors = errors.filter(el=> el[1] !== undefined)
        filteredErrors.forEach(e=> e && setErr(e[0], e[1]))
        if(filteredErrors.length > 0) return

        if(filteredErrors.length === 0 && (!isLoginExist.exists || !isLoginExist.isRegistrationCompleted || isLoginExist.profilesCount === 0)) {
          appContext.showModal<IRegistrationModalProps>(ModalType.RegistrationModal, {
            email: formik.values.email,
            onComplete: () => {
              setProgress(page||progress+1)
            }
          })
        }
        else {
          setErr('email', t('registration_emailExist'))
        }
      })()
      break
      case 2:(async() => {
        const values = ['phone']
        validateValues(values)
        .then(res=> {
          if(res === false) {
            setErr('email', t('registration_enterCorrectEmail'))
          }
          else {
            RegistrationRepository.checkEmailOrPhoneExists(formik.values.phone)
            .then(r=> {
              if(!r.exists||!r.isRegistrationCompleted||r.profilesCount === 0) setProgress(page||progress+1)
              else {setErr('phone', t('registration_phoneExist'))}
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
    <InputField
    label={'E-mail:'}
    className={styles.input}
    labelType='top'
    styleType={'default'}
    color={'default'}
    name={'email'}
    validate={Validator.combine([Validator.required, Validator.email])}
    />
    <PasswordField label={`${t('password')}:`} name={'password'} className={styles.input} />
    <div className={styles.agreement}>
      <CheckboxField 
      circleClassName={styles.checkCircle} 
      itemClassName={styles.check} 
      itemLabelClassName={styles.checkLabel} 
      name={'agreement'} 
      value={true} 
      label={<>{t('registration_tip1')}  <Link className={styles.link} href={'/privacy'}>{t('registration_tip2')} </Link> {t('and')} <Link className={styles.link} href={'/rules'}>{t('registration_tip3')} </Link></>}/>
    </div>
    </>
  )

  const stage2 = (<>
    <P className={styles.uneditable}>
      {`E-mail: ${formik.values.email}`}
    </P>
    <PhoneCountryField
    styleType={'horizontal'}
    disabled={false}
    placeholder={'000 000 00 00'}
    name={'phone'}
    className={styles.input}
    defaultCountry={'RU'}
    label={`${t('phone')}:`}
    validate={Validator.phone}
    />
  </>)

  const stage3 =(<>
    <InputField
    label={`${t('name')}:`}
    className={styles.input}
    labelType='top'
    styleType={'default'}
    color={'default'}
    name={'firstName'}
    validate={Validator.combine([Validator.required, Validator.onlyChars])}
    />

    <InputField
    label={`${t('lastName')}:`}
    className={styles.input}
    labelType='top'
    styleType={'default'}
    color={'default'}
    name={'lastName'}
    validate={Validator.combine([Validator.required, Validator.onlyChars])}
    />

    <InputField
    label={`${t('patronymic')}:`}
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
    label={`${t('registration_companyName')}:`}
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
    labelName={`${t('country')}: `}
    requestFn={LocationRepository.searchCountry}
    className={styles.dropInput}
    />

    <LocationDropDownInput
    onSetOption={cityHandler}
    name={'cityId'}
    labelName={`${t('city')}: `}
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
    if(!props.token) {
      setProgress(1)
      formik.resetForm()
    }
  }, [userContext.profileType])

  useEffect(()=>{
    if(userContext.user) {
      const dataToSet: Partial<IRegistrationComplete> = {
        email: userContext.user.email,
        lastName: userContext.user.lastName,
        firstName: userContext.user.firstName,
        phone: userContext.user.phone
      }
      formik.setValues({...formik.values, ...clearObject(dataToSet)})
    }
  }, [userContext.user])

  useEffect(()=>{
    if(props.token) {
      userContext.setToken(props.token)
      formik.setValues({...formik.values, agreement: true})
    }
  }, [props.token])

  useEffect(()=>{
    sendToMetrika(AppMetricaEvent.StartRegistration)
  }, [])

  useEffect(()=>{
    isTabletWidth && appContext.showModal(ModalType.ProfileTypeSwitcher)
  }, [isTabletWidth])

  return (
    <div className={styles.root}>
      {!isTabletWidth&&
        <UserRegImage type={userContext.profileType} className={styles.regImage}/>
      }
      <div className={styles.content}>
        <P useThemeColor className={styles.title}>
          {isTabletWidth&&<BackBtn onClick={()=>{router.back()}} />}
          {t('registration')}
          {!isTabletWidth&&<Image src={'/icons/scribe.png'} width={'24'} height={'24'} alt={'scribeIcon'}/>}
        </P>
        <P useThemeColor className={styles.subTitle}>
          {t('registration_haveAccount')}
          <Link className={styles.loginLink} href={'/login'}>{t('login')}</Link>
        </P>
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
                <Button className={styles.submitButton} type='button' onClick={()=> nextPageValidator(progress - 1)}>{t('back')}</Button>
              }
              {((userContext.profileType ===ProfileType.Employee &&progress === 3)||(userContext.profileType ===ProfileType.Hirer &&progress === 4)) &&
                <Button title={'register'} disabled={disableButton} className={styles.submitButton} type='button' onClick={()=> formik.submitForm()}>
                  {t('registration_getRegister')}
                </Button>
                ||
                <Button title="next" disabled={formik.values.agreement === undefined||formik.values.agreement ===false} className={styles.submitButton} type='button' onClick={()=> nextPageValidator()}>{t('continue')}</Button>
              }
            </div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  )
}
