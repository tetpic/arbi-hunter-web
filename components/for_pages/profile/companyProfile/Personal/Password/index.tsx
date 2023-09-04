import InputField from 'components/fields/InputField'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import Button from 'components/ui/Button'
import { Form, FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import Validator from 'utils/Validator'
import styles from './index.module.scss'

interface Props {
}

interface PersonalPassword {
  oldPassword: string,
  password: string
}

export default function ChangePassword(props: Props) {

  const [passwordIsOpen, setPasswordOpen] = useState<boolean>(false)
  const [oldPasswordIsOpen, setOldPasswordOpen] = useState<boolean>(false)

  const passwordHandler = () => {
    setPasswordOpen(!passwordIsOpen)
  }
  
  const oldPasswordHandler = () => {
    setOldPasswordOpen(!oldPasswordIsOpen)
  }

  const submitPassword = (data: PersonalPassword) => {
    debugger
  }

  const passwordFormik = useFormik<PersonalPassword>({
    initialValues: {
      oldPassword: '',
      password: ''
    },
    onSubmit: submitPassword
  })

  return (
    <FormikProvider value={passwordFormik}>
      <Form className={styles.root}>
        <InputField 
        label={'Старый пароль:'}
        className={styles.input} 
        labelType='top' 
        styleType={'default'} 
        color={'default'} 
        name={'oldPassword'} 
        type={oldPasswordIsOpen?'text':'password'}
        suffix={'icon'}
        suffixIcon={oldPasswordIsOpen?<OpenEyeSvg/>: <CloseEyeSvg/>}
        onSuffixClick={oldPasswordHandler}
        validate={Validator.required}
        />
        <InputField 
        label={'Новый пароль:'}
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
        <Button className={styles.button}>Сохранить</Button>
      </Form>
    </FormikProvider>
  )
}