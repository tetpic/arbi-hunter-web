import styles from './index.module.scss'
import InputField from 'components/fields/InputField'
import BigHomeSvg from 'components/svg/BigHomeSvg'
import { useAppContext } from 'context/state'
import { IRegistrationComplete, ProfileType } from 'data/interfaces/IRegistration'
import { Form, FormikProvider, useFormik } from 'formik'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
}

export default function Registration(props: Props) {

  const appContext = useAppContext()

  const submit = (data: IRegistrationComplete) => {

  }


  const formik = useFormik<IRegistrationComplete>({
    initialValues: {
      firstName: '',
      lastName: '',
      password: '',
      countryId: undefined,
      cityId: undefined,
      profileType: appContext.profileType,
      telegramNickname: '',
      email: '',
      [appContext.profileType === ProfileType.Hirer&& 'company']:undefined  
    },
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
          <Form className={styles.form}>
            <InputField className={styles.input} labelType='top' styleType={'default'} color={'default'} name={'firstName'} label={'Имя:'}/>
            <InputField className={styles.input} labelType='top' styleType={'default'} color={'default'} name={'lastName'} label={'Фамилия:'}/>
            {appContext.profileType === ProfileType.Hirer &&
              <InputField className={styles.input} labelType='top' styleType={'default'} color={'default'} name={'company'} label={'Название компании:'}/>
            }
            <InputField className={styles.input} labelType='top' styleType={'default'} color={'default'} name={'telegramNickname'} label={'Telegram:'}/>


          </Form>
        </FormikProvider>
        <button className={styles.submitButton} type='button' onClick={formik.submitForm}>Зарегистрироваться</button>
        
      </div>
    </div>
  )
}