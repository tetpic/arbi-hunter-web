import styles from './index.module.scss'

import P from '@/components/ui/P'
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
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: ()=> void
  managerToEdit?: IManager
}

export default function AddManager(props: Props) {
  const {t} = useTranslation()
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
    {!userContext.currentProfile?.hirerRole &&
    <>
      <P styleType={['large', 'w600']} useThemeColor>{t('managers_status')}</P>     
      <RadioListField 
      name={'hirerRole'} 
      itemLabelClassName={styles.radioItem_label}
      labelClassName={styles.radioWrapper_label}
      options={Object.values(HirerRole).map(el=> {return {value: el, label: TranslateHirerRole(el, t)}})}
      />
    </>
  }

    <P styleType={['large', 'w600']}useThemeColor>{t('managers_permissions')}</P>     
    <CheckboxListField 
    name={'permissions'}
    options={Object.values(HirerRolePermission).map(el=>{return {value: el, label: TranslateHirerRolePermission(el, t)}})} 
    />
  </>)

  const page2 = (<>
    <P styleType={['large', 'w600']} useThemeColor>{t('managers_personalData')}</P>  
    
    <InputField 
    label={t('lastName')}
    labelType={'top'}
    name={'lastName'}
    styleType={'default'} 
    color={'default'} 
    />

    <InputField 
    name={'firstName'}
    label={t('name')}
    labelType={'top'}
    styleType={'default'} 
    color={'default'} 
    validate={Validator.required}
    />

    <InputField 
    name={'patronymic'}
    label={t('patronymic')}
    labelType={'top'}
    styleType={'default'} 
    color={'default'} 
    />

    <InputField 
    label={t('managers_position')}
    labelType={'top'}
    name={'position'}
    styleType={'default'} 
    color={'default'} 
    validate={Validator.required}
    />     

    <PhoneCountryField 
    styleType={'horizontal'} 
    disabled={false} placeholder={'000 000 00 00'} 
    name={'phone'}  
    inputClassName={styles.input} 
    defaultCountry={'RU'}
    label={t('phone')}
    validate={Validator.required}
    />

    <PasswordField notRequired={managerToEdit?true:false}/>

    <PasswordField notRequired={managerToEdit?true:false} 
    name='passwordConfirm'
    label={t('login_repeatPassword')}
    />

    <InputField   
    label={'E-mail:'}
    className={styles.input} 
    inputMode='email'
    labelType='top' 
    styleType={'default'} 
    color={'default'} 
    name={'email'} 
    validate={Validator.combine([Validator.required, Validator.email])}
    />

    <TextAreaField name={'comment'} onChange={(e)=>formik.setFieldValue('comment', e.target.value)} autoSize label={t('managers_comment')}/>

  </>)

  return (<div className={styles.root}> 
    <BackTextButton onClick={page===1?props.onClose:()=>setPage(1)}/>
    <P styleType={['huge','w600']} useThemeColor className={styles.title}>{managerToEdit? t('managers_editData') : t('managers_addManager')}</P>
    <FormikProvider value={formik} >
      <Form className={styles.form}>
        {page === 1 && page1}
        {page === 2 && page2}
      </Form>
    </FormikProvider>
    <div className={styles.buttonsWrapper}>
      {page === 2 &&
        <Button styleType={['gradient']} onClick={formik.submitForm}>{t('save')}</Button>
        ||
        <Button styleType={['gradient']} type='button' onClick={()=>setPage(2)}>{t('continue')}</Button>
      }
    </div>
  </div>)
}