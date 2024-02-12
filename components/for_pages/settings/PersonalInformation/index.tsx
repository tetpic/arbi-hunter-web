import PhoneCountryField from '@/components/fields/PhoneCountryField'
import styles from './index.module.scss'
import InputField from 'components/fields/InputField'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import { IUserProfile } from 'data/interfaces/IUser'
import { Form, FormikProvider, useFormik } from 'formik'
import { SnackbarType } from 'types/enums'
import Validator from 'utils/Validator'

interface Props {
}


export default function PersonalInformation(props: Props) {

  const userContext = useUserContext()
  const appContext = useAppContext()

  const submitData = (data: Partial<IUserProfile>) =>{
    userContext.editCurrentProfile(data)
    .then(res=> {
      if(res) {
        appContext.showSnackbar('Данные сохранены', SnackbarType.success)
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
      {/* <Scrollbars universal style={{height: '100%'}}> */}
        <div className={styles.wrapper}>
          <InputField 
          styleType={'default'} 
          color={'default'} 
          name={'firstName'}
          label={'Имя: '}
          labelType={'top'}
          />

          <InputField 
          styleType={'default'} 
          color={'default'} 
          name={'lastName'}
          label={'Фамилия: '}
          labelType={'top'}
          />

          <InputField 
          styleType={'default'} 
          color={'default'} 
          name={'patronymic'}
          label={'Отчество: '}
          labelType={'top'}
          />

          <InputField   
          label={'Электронная почта:'}
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
          />
        </div>
        <Button className={styles.button}>Сохранить</Button>
      </Form>
    </FormikProvider>
  )
}