import PhoneCountryField from '@/components/fields/PhoneCountryField'
import styles from './index.module.scss'
import InputField from 'components/fields/InputField'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import { IUserProfile } from 'data/interfaces/IUser'
import { Form, FormikProvider, useFormik } from 'formik'
import { SnackbarType } from 'types/enums'
// import Validator from 'utils/Validator'
import useTranslation from 'next-translate/useTranslation'
import Validator from 'utils/Validator'

interface Props {
}


export default function PersonalInformation(props: Props) {
  const {t} = useTranslation()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const personalContext = useUserContext()

  const submitData = (data: Partial<IUserProfile>) =>{
    
    userContext.editCurrentProfile(data)
    .then(res=> {
      if(res) {
        appContext.showSnackbar(t('data_saved'), SnackbarType.success)
      }
    })
  }

  const dataFormik = useFormik<Partial<IUserProfile>>({
    initialValues: {
      firstName: userContext.currentProfile?.firstName,
      lastName: userContext.currentProfile?.lastName,
      patronymic: userContext.currentProfile?.patronymic,
      email: userContext.currentProfile?.email,
      phone: userContext.currentProfile?.phone
    },
    onSubmit: submitData
  })

  return (
    <FormikProvider value={dataFormik} >
      <Form className={styles.root}>      
        <div className={styles.wrapper}>
          <InputField 
          styleType={'default'} 
          color={'default'} 
          name={'firstName'}
          label={`${t('name')}: `}
          labelType={'top'}
          onlyLetters
          validate={Validator.required}
          />

          <InputField 
          styleType={'default'} 
          color={'default'} 
          name={'lastName'}
          onlyLetters
          label={`${t('lastName')}: `}
          labelType={'top'}
          validate={Validator.required}

          />

          <InputField 
          styleType={'default'} 
          color={'default'} 
          name={'patronymic'}
          onlyLetters
          label={`${t('patronymic')}: `}
          labelType={'top'}
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

          <PhoneCountryField 
          styleType={'horizontal'} 
          disabled={false} 
          placeholder={'000 000 00 00'} 
          name={'phone'}  
          className={styles.input} 
          validate={Validator.combine([Validator.required, Validator.phone])}
          defaultCountry={userContext.currentProfile?.countryCode}
          label={`${t('phone')}:`}
          />
        </div>
        <Button className={styles.button}>{t('save')}</Button>
      </Form>
    </FormikProvider>
  )
}