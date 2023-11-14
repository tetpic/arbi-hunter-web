import CheckboxListField from 'components/fields/CheckboxListField'
import InputField from 'components/fields/InputField'
import PasswordField from 'components/fields/PasswordField'
import PhoneCountryField from 'components/fields/PhoneCountryField'
import RadioListField from 'components/fields/RadioListField'
import BackTextButton from 'components/ui/BackTextButton'
import Button from 'components/ui/Button'
import { IManager, IManagerCreate } from 'data/interfaces/IManager'
import ManagerRepository from 'data/repositories/ManagerRepository'
import { Form, FormikProvider, useFormik } from 'formik'
import { HirerRole, HirerRolePermission } from 'types/enums'
import { TranslateHirerRole, TranslateHirerRolePermission } from 'utils/enumsTranslations'
import Validator from 'utils/Validator'
import styles from './index.module.scss'

interface Props {
  onClose: ()=> void
  managerToEdit?: IManager
}

export default function AddManager(props: Props) {
  const managerToEdit = props.managerToEdit
  const submit = (data: IManagerCreate) => {
    
    if(managerToEdit) {
      if(data.password === '') {
        delete data.password
      }
      
      ManagerRepository.editManagerById(data, managerToEdit?.id)
      .then(res=> {
        props.onClose()
      })
      .catch(err=> {})
    }
    else {
      ManagerRepository.createNewManager(data)
      .then(res=> {
        props.onClose()
      })
      .catch(err=> {})
    }
  }

  const formik = useFormik<IManagerCreate>({
    initialValues: {
      hirerRole: managerToEdit?.hirerRole||HirerRole.Manager,
      firstName: managerToEdit?.firstName||'',
      lastName: managerToEdit?.lastName||'',
      position: managerToEdit?.position||'',
      password: '',
      email: managerToEdit?.email||'',
      phone: managerToEdit?.phone||'',
      permissions: managerToEdit?.permissions||[]
    },
    onSubmit: submit
  })

  return (<div className={styles.root}> 
    <BackTextButton onClick={props.onClose}/>
    <p className={styles.title}>{managerToEdit? 'Редактирование данных менеджера ' : 'Новый менеджер'}</p>
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

        <PasswordField notRequired={managerToEdit?true:false}/>

        <Button className={styles.button}>Сохранить</Button>

      </Form>
    </FormikProvider>
  </div>)
}