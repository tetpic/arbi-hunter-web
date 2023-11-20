import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import {useState } from 'react'
import { ICV } from 'data/interfaces/ICV'
import { Form, FormikProvider, useFormik } from 'formik'
import { useAppContext } from 'context/state'
import RadioListField from 'components/fields/RadioListField'
import TextAreaField from 'components/fields/TextAreaField'
import PlusSvg from 'components/svg/PlusSvg'
import { colors } from 'styles/variables'
import Button from 'components/ui/Button'
import Validator from 'utils/Validator'
import ApplicationRepository from 'data/repositories/ApplicationRepository'
import { IApplication } from 'data/interfaces/IApplication'
import { ModalType } from 'types/enums'
import CrossSvg from 'components/svg/CrossSvg'

interface Props {
  onClose: ()=>void
}

export interface IApplicationModalProps {
  vacancyId: number,
  cvs: ICV[]

}

export default function ApplicationModal(props: Props) {
  const appContex = useAppContext()
  const modalArguments = appContex.modalArguments as IApplicationModalProps
  const [showTextField, setShowTextField] = useState<boolean>(false)

  const submit = (data: {vacancyId: number, cvId: number, coverLetter: string}) => {
    ApplicationRepository.sendApplication(data as IApplication)
    .then(res=> {
      debugger
      appContex.showModal(ModalType.ApplicationSuccessModal)
    })


  }

  const formik = useFormik<{vacancyId: number, cvId: number, coverLetter: string}>({
    initialValues: {
      vacancyId: modalArguments.vacancyId,
      cvId: undefined,
      coverLetter: undefined
    },
    onSubmit: submit
  })


  const body = (
    <div className={styles.root}>
      <Button className={styles.closeButton} onClick={props.onClose}><CrossSvg/></Button>
      <FormikProvider value={formik}>
        <Form>
          {modalArguments?.cvs?.length > 0 &&
            <RadioListField 
            validate={Validator.required}
            options={modalArguments.cvs.filter(f=> f.moderationStatus === 'approved'&&f.published===true).map(cv => {return {value: cv.id, label: cv.categories[0].name }})} 
            name={'cvId'}/>
          }
          {showTextField && 
            <TextAreaField areaClassname={styles.textArea} onChange={(e)=> formik.setFieldValue('coverLetter', e.target.value)} autoSize name={'coverLetter'}/>
          }
          {!showTextField && 
            <p className={styles.addCover} onClick={()=>setShowTextField(true)}><PlusSvg color={colors.yellow} />Сопроводительное письмо</p>
          } 
        </Form>
      </FormikProvider>
      <Button className={styles.nextButton} onClick={formik.submitForm}>Продолжить</Button>

    </div>
  )

  return (<ModalLayout>
    <ModalBody>
      {body}

    </ModalBody>
  </ModalLayout>)
}