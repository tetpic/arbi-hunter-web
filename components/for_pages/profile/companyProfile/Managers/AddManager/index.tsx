import P from '@/components/ui/P'
import styles from './index.module.scss'

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
import { useState } from 'react'
import TextAreaField from '@/components/fields/TextAreaField'
import { useUserContext } from 'context/user_state'

interface Props {
  onClose: ()=> void
  managerToEdit?: IManager
}

export default function AddManager(props: Props) {
  const managerToEdit = props.managerToEdit
  const userContext = useUserContext()
  const [page, setPage] = useState<number>(1)

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
      patronymic: managerToEdit?.patronymic||'',
      lastName: managerToEdit?.lastName||'',
      position: managerToEdit?.position||'',
      password: '',
      passwordConfirm: '',
      email: managerToEdit?.email||'',
      phone: managerToEdit?.phone||'',
      permissions: managerToEdit?.permissions||[],
      comment: ''
    },
    onSubmit: submit
  })

  const page1 = (<>
    {!userContext.currentProfile.hirerRole &&
    <>
      <P styleType={['large', 'w600']}>Статус</P>     
      <RadioListField 
      name={'hirerRole'} 
      itemLabelClassName={styles.radioItem_label}
      labelClassName={styles.radioWrapper_label}
      options={Object.values(HirerRole).map(el=> {return {value: el, label: TranslateHirerRole(el)}})}
      />
    </>
  }

    <P styleType={['large', 'w600']}>Права</P>     
    <CheckboxListField 
    name={'permissions'}
    options={Object.values(HirerRolePermission).map(el=>{return {value: el, label: TranslateHirerRolePermission(el)}})} 
    />
  </>)

  const page2 = (<>
    <P styleType={['large', 'w600']}>Личные данные</P>  
    
    <InputField 
    label='Фамилия:'
    labelType={'top'}
    name={'lastName'}
    styleType={'default'} 
    color={'default'} 
    />

    <InputField 
    name={'firstName'}
    label={'Имя:'}
    labelType={'top'}
    styleType={'default'} 
    color={'default'} 
    validate={Validator.required}
    />

    <InputField 
    name={'patronymic'}
    label={'Отчество:'}
    labelType={'top'}
    styleType={'default'} 
    color={'default'} 
    />

    <InputField 
    label='Должность:'
    labelType={'top'}
    name={'position'}
    styleType={'default'} 
    color={'default'} 
    validate={Validator.required}
    />
      
    {/* <InputField 
    label='Регион:'
    labelType={'top'}
    name={'region'}
    styleType={'default'} 
    color={'default'} 
    /> */}

    <PhoneCountryField 
    styleType={'horizontal'} 
    disabled={false} placeholder={'000 000 00 00'} 
    name={'phone'}  
    inputClassName={styles.input} 
    defaultCountry={'RU'}
    label={'Телефон:'}
    validate={Validator.required}
    />

    <PasswordField notRequired={managerToEdit?true:false}/>

    <PasswordField notRequired={managerToEdit?true:false} 
    name='passwordConfirm'
    label='Подтвердите пароль:'
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

    <TextAreaField name={'comment'} autoSize label='Комментарий'/>

  </>)

  return (<div className={styles.root}> 
    <BackTextButton onClick={page===1?props.onClose:()=>setPage(1)}/>
    <P styleType={['huge','w600']} className={styles.title}>{managerToEdit? 'Редактирование данных менеджера ' : 'Добавить менеджера'}</P>
    <FormikProvider value={formik} >
      <Form className={styles.form}>
        {page === 1 && page1}
        {page === 2 && page2}
      </Form>
    </FormikProvider>
    <div className={styles.buttonsWrapper}>
      {page === 2 &&
        <Button styleType={['gradient']} onClick={formik.submitForm}>Сохранить</Button>
        ||
        <Button styleType={['gradient']} type='button' onClick={()=>setPage(2)}>Продолжить</Button>
      }
    </div>
  </div>)
}