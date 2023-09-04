import InputField from 'components/fields/InputField'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import RadioListField from 'components/fields/RadioListField'
import BackTextButton from 'components/ui/BackTextButton'
import Button from 'components/ui/Button'
import { Form, FormikProvider, useFormik } from 'formik'
import Validator from 'utils/Validator'
import styles from './index.module.scss'

interface Props {
  onClose: ()=> void
}

interface NewManager {
  rights: string
  archive?: string
  active?: string
  personalData: string
  firstName: string
  lastName: string
  position?: string
  region?: string
  phone?: string
  email?: string
}




export default function AddManager(props: Props) {


  const submit = (data: NewManager) => {
    debugger
  }

  const formik = useFormik<NewManager>({
    initialValues: {
      rights: 'manager',
      archive: '',
      active: '',
      personalData: '',
      firstName: '',
      lastName: '',
      position: '',
      region: '',
      phone: '',
      email: '',
    },
    onSubmit: submit
  })

  return (<div className={styles.root}> 
    <BackTextButton onClick={props.onClose}/>
    <p className={styles.title}>Новый менеджер</p>
    <FormikProvider value={formik} >
      <Form className={styles.form}>
     
        <RadioListField 
        label='Статус сотрудника'
        name={'rights'} 
        itemCircleClassname={styles.radioCircle}
        itemClassName={styles.radioItem}
        activeItemClassName={styles.radioItem_active}
        wrapperClassName={styles.radioWrapper}
        itemLabelClassName={styles.radioItem_label}
        labelClassName={styles.radioWrapper_label}
        options={[
          {value: 'manager', label: 'Менеджер'},
          {value: 'admin', label: 'Администратор'}
        ]}
        />

        <p className={styles.subTitle}>Дополнительные права для работы</p>

        <InputField 
        styleType={'default'} 
        color={'default'} 
        name={'active'}
        labelType={'top'}
        label={'С активными вакансиями:'}
        />

        <InputField 
        styleType={'default'} 
        color={'default'} 
        name={'archive'}
        labelType={'top'}
        label={'С архивом вакансий:'}
        />

        <InputField 
        styleType={'default'} 
        color={'default'} 
        name={'personalData'}  
        labelType={'top'}      
        label={'С личными данными менеджеров:'}
        />

        <p className={styles.subTitle}>Личные данные</p>

        <InputField 
        name={'firstName'}
        label={'Имя:'}
        labelType={'top'}
        styleType={'default'} 
        color={'default'} 
        />

        <InputField 
        label='Фамилия:'
        labelType={'top'}
        name={'lastName'}
        styleType={'default'} 
        color={'default'} 
        />

        <InputField 
        label='Должность менеджера:'
        labelType={'top'}
        name={'position'}
        styleType={'default'} 
        color={'default'} 
        />

        <InputField 
        label='Регион:'
        labelType={'top'}
        name={'region'}
        styleType={'default'} 
        color={'default'} 
        />

        <PhoneCountryField 
        styleType={'horizontal'} 
        disabled={false} placeholder={'000 000 00 00'} 
        name={'phone'}  
        inputClassName={styles.input} 
        defaultCountry={'RU'}
        label={'Телефон:'}
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

        <Button className={styles.button}>Сохранить</Button>

      </Form>
    </FormikProvider>
  

  </div>)
}