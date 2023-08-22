import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import background from '../../../images/regModalBack.webp'
import Image from 'next/image'
import ArbiLogoSvg from 'components/svg/ArbiLogoSvg'
import ArbiLogoTextSvg from 'components/svg/ArbiLogoTextSvg'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import { Form, FormikProvider, useField, useFormik } from 'formik'
import { IRegistrationPhone } from 'data/interfaces/IRegistration'
import { useState } from 'react'
import Link from 'next/link'
import { useAppContext } from 'context/state'
import { SnackbarType } from 'types/enums'

interface Props {
}

enum RegPages {
  Phone='phone',
  Code='code'
}

export default function RegistrationModal(props: Props) {
  const appContext = useAppContext()


  const [page, setPage] = useState<RegPages>(RegPages.Phone)
  const [loading, setLoading] = useState<boolean>(false)

  

  const submit = (data: IRegistrationPhone) => {
    debugger
  }

 

  const formik = useFormik<IRegistrationPhone>({
    initialValues: {
      phone: '',
      code: ''
    },
    onSubmit: submit
  })

  const nextHandler = () => {
    debugger
    if(formik.values.phone.length < 10) {
      appContext.showSnackbar('Укажите телефон полностью', SnackbarType.error)
    } else {
      setLoading(true)

      setPage(RegPages.Code)
    }
  }

  const header = (
    <div className={styles.header}>
      <ArbiLogoSvg/>
      <ArbiLogoTextSvg/>
    </div>
  )

  const phoneField = (<>
  <div className={styles.phoneField}>
    <p className={styles.title}>Регистрация</p>
    <PhoneCountryField 
    styleType={'horizontal'} 
    disabled={false} 
    placeholder={'000 000 00 00'} 
    name={'phone'}  
    inputClassName={styles.input} 
    defaultCountry={'RU'}
    label={'Телефон:'}
    />
    <p className={styles.disclaimer}>
      Продолжая регистрацию на&nbsp;сайте любыми доступными способами, 
      вы&nbsp;подтверждаете, что ознакомлены 
      и&nbsp;полностью согласны с&nbsp;условиями 
      использования сайта.    
    </p>
    <button className={styles.nextButton} type='button' onClick={nextHandler}>Продолжить</button>
    <p className={styles.haveAccount}>Уже есть аккаунт? <Link className={styles.haveAccount_link} href={'/login'}>Войти</Link></p>
  </div>
  </>)

  const codeField = {

  }

  const body = (<div className={styles.body}>
    <FormikProvider value={formik}>
      <Form>
      <>
        {page === RegPages.Phone && phoneField}
        {page === RegPages.Code && codeField}
      </>
      </Form>
    </FormikProvider>
  </div>)

  return ( 
    <ModalLayout fixed className={styles.modalRoot}>
      <Image src={background} alt={'modalBack'} className={styles.background} />
      {header}
      {body}
    </ModalLayout>
  )
}