import InputField from 'components/fields/InputField'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import Button from 'components/ui/Button'
import { Form, FormikProvider, useFormik } from 'formik'
import Validator from 'utils/Validator'
import styles from './index.module.scss'

interface Props {
}

interface PersonalData {
  position: string,
  phone: string,
  email: string
}

export default function PersonalInformation(props: Props) {

  const submitData = (data: PersonalData) =>{
    debugger
  }

  const dataFormik = useFormik<PersonalData>({
    initialValues: {
      position: '',
      phone: '',
      email: ''
    },
    onSubmit: submitData
  })

  return (
    <FormikProvider value={dataFormik} >
      <Form className={styles.root}> 
        <InputField 
        styleType={'default'} 
        color={'default'} 
        name={'position'}
        label={'Должность менеджера: '}
        labelType={'top'}
        />

        <PhoneCountryField 
        styleType={'horizontal'} 
        disabled={false} 
        placeholder={'000 000 00 00'} 
        name={'phone'}  
        inputClassName={styles.input} 
        defaultCountry={'RU'}
        label={'Телефон:'}
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

        <Button className={styles.button}>Сохранить</Button>
      </Form>
    </FormikProvider>
  )
}