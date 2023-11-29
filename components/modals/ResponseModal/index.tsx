import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import { ICV } from 'data/interfaces/ICV'
import { IApplication } from 'data/interfaces/IApplication'
import { useAppContext } from 'context/state'
import { Form, FormikProvider, useFormik } from 'formik'
import UserPic from 'components/ui/UserPic'
import { useEffect, useState } from 'react'
import CvRepository from 'data/repositories/CvRepository'
import TextAreaField from 'components/fields/TextAreaField'
import Button from 'components/ui/Button'
import Validator from 'utils/Validator'
import ApplicationRepository from 'data/repositories/ApplicationRepository'
import { SnackbarType } from 'types/enums'
import { IProposal } from 'data/interfaces/IProposal'
import classNames from 'classnames'

interface Props {
  onClose?: () => void
  isBottomSheet?: boolean
}

export interface IResponseModalProps {
  cv?: ICV
  application: IApplication,
  onSubmit?: (msg: IProposal) => void
}

export default function ResponseModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as IResponseModalProps
  const [currentCv, setCurrentCv] = useState<ICV>(null)

  const submit = (data: {coverLetter: string}) => {
    ApplicationRepository.patchApplicationRespond(args.application.id, data)
    .then(res=> {
      
      appContext.showSnackbar('Сопроводительное письмо успешно отправлено', SnackbarType.success)
      args.onSubmit(res)
      props.onClose()
    })
  }

  const formik = useFormik<{coverLetter: string}>({
    initialValues: {
      coverLetter: null
    },
    onSubmit: submit
  })

  const body = (<>
    <div className={styles.top}>
      <UserPic className={styles.picture}/>
      <p className={styles.resume}>Резюме</p>
      <p className={styles.name}>{currentCv?.categories[0]?.name}</p>
    </div>
    <FormikProvider value={formik}>
      <Form className={classNames(styles.form, props.isBottomSheet&&styles.form__bottom)}>
        <TextAreaField 
        placeholder='Ваше сопроводительное письмо' 
        areaClassname={styles.textArea}
        autoSize
        onChange={(e)=>formik.setValues({coverLetter: e.currentTarget.value})}
        name={'coverLetter'}
        validate={Validator.required}
        />
        <Button className={styles.button} type='submit'>
          Отправить
        </Button>
      </Form>
    </FormikProvider>
  </>)

  useEffect(()=>{
    CvRepository.getById(args.cv.id)
    .then(res=>{
      setCurrentCv(res)
    })
  }, [])



  return (<ModalLayout mobileFullScreen>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}
