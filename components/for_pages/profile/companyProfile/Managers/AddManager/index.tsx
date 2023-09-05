import CheckboxListField from 'components/fields/CheckboxListField'
import InputField from 'components/fields/InputField'
import PasswordField from 'components/fields/PasswordField'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import RadioListField from 'components/fields/RadioListField'
import BackTextButton from 'components/ui/BackTextButton'
import Button from 'components/ui/Button'
import { IManagerCreate } from 'data/interfaces/IManager'
import ManagerRepository from 'data/repositories/ManagerRepository'
import { Form, FormikProvider, useFormik } from 'formik'
import { HirerRole, HirerRolePermission } from 'types/enums'
import { TranslateHirerRole, TranslateHirerRolePermission } from 'utils/enumsTranslations'
import Validator from 'utils/Validator'
import styles from './index.module.scss'

interface Props {
  onClose: ()=> void
}






export default function AddManager(props: Props) {


  const submit = (data: IManagerCreate) => {
    debugger
    ManagerRepository.createNewManager(data)
    .then(res=> {
      debugger
    })
    .catch(err=> {
      debugger
    })
  }

  const formik = useFormik<IManagerCreate>({
    initialValues: {
      hirerRole: HirerRole.Manager,
      firstName: '',
      lastName: '',
      position: '',
      password: '',
      email: '',
      phone: '',
      permissions: []
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
        name={'hirerRole'} 
        itemCircleClassname={styles.radioCircle}
        itemClassName={styles.radioItem}
        activeItemClassName={styles.radioItem_active}
        wrapperClassName={styles.radioWrapper}
        itemLabelClassName={styles.radioItem_label}
        labelClassName={styles.radioWrapper_label}
        options={Object.values(HirerRole).map(el=> {return {value: el, label: TranslateHirerRole(el)}})}
        />

        <p className={styles.subTitle}>Дополнительные права для работы</p>

        <CheckboxListField 
        name={'permissions'}
        options={Object.values(HirerRolePermission).map(el=>{return {value: el, label: TranslateHirerRolePermission(el)}})} 
        />

        {/* <InputField 
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
        /> */}

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

        <PasswordField/>

        <Button className={styles.button}>Сохранить</Button>

      </Form>
    </FormikProvider>
  

  </div>)
}