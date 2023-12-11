import styles from './index.module.scss'

import InputField from 'components/fields/InputField'
import RadioListField from 'components/fields/RadioListField'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { ICategory, UpdateCommunityForm } from 'data/interfaces/Common'
import { Form, FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import Validator from 'utils/Validator'
import classNames from 'classnames'

interface Props {
  onClose: ()=>void
}

export interface ICreateNewCommunityModal {
  submit: (data: UpdateCommunityForm)=> void, categories: ICategory[]
}


export default function CreateNewCommunityModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as ICreateNewCommunityModal

  const [page, pager] = useState<number>(1)

  const formik = useFormik<UpdateCommunityForm>({
    initialValues: {
      name: '',
      categoryId: null
    },
    onSubmit: args.submit
  })

  const pageValidator = (pageNumber?: 2) => {

    formik.validateForm().then(res=> {
      
      if(!res.name && pageNumber) {
        pager(pageNumber)
      }
      else if(res.categoryId) {
        return
      }
      else {
        formik.submitForm()
      }
    })
  }

  const body = (
  <FormikProvider value={formik}>
    <Form className={styles.form}>
      <p className={styles.title}>{page === 1 ?'Введите название сообщества': 'Выберите категорию'}</p>
      {page === 1 ?
      <InputField 
      styleType={'default'} 
      placeholder={'Введите текст'} 
      color={'default'} 
      validate={Validator.required}
      name={'name'}/>
      :
      <RadioListField 
      wrapperClassName={styles.radioList}
      itemClassName={styles.radioItem}  
      name={'categoryId'} 
      activeItemClassName={styles.radioItem_active}
      options={args.categories.map(c=> {
        return {label: c.name, value: c.id}
      })}/>
      }
      <div className={styles.buttonsWrapper}>
        <Button className={styles.blackButton} onClick={page===1?props.onClose:()=>{pager(1)}} type='button'>Отменить</Button>
        {page === 1 &&
        <Button className={classNames(styles.yellowButton, formik.values.name.length === 0&& styles.disabled)} type='button' onClick={()=>pageValidator(2)}>Продолжить</Button>
        ||
        page === 2 &&
        <Button className={classNames(styles.yellowButton, !formik.values.categoryId&&styles.disabled)} onClick={()=>pageValidator()} type='button'>Создать</Button>
        }
      </div>
    </Form>
  </FormikProvider>
  )

  return (
    <ModalLayout className={styles.modalLayout}>
      <ModalBody >
        {body}
      </ModalBody>
    </ModalLayout>
  )
}