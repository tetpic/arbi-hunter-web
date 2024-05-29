import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import { useState } from 'react'
import { ICV } from 'data/interfaces/ICV'
import { Form, FormikProvider, useFormik } from 'formik'
import { useAppContext } from 'context/state'
import RadioListField from 'components/fields/RadioListField'
import TextAreaField from 'components/fields/TextAreaField'
import PlusSvg from 'components/svg/PlusSvg'
import { colors } from 'styles/variables'
import Button from 'components/ui/Button'
import ApplicationRepository from 'data/repositories/ApplicationRepository'
import { IApplication } from 'data/interfaces/IApplication'
import { ModalType, SnackbarType } from 'types/enums'
import CrossSvg from 'components/svg/CrossSvg'
import { IApplicationSuccessModalProps } from '../ApplicationSuccessModal'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import { IVacancy } from 'data/interfaces/IVacancy'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import Spacer from '@/components/ui/Spacer'

interface Props {
  onClose: ()=>void
  isBottomSheet?: boolean
}

export interface IApplicationModalProps {
  vacancy: IVacancy,
  cvs: ICV[]
  onSet?: () => void
}

export default function ApplicationModal(props: Props) {
  const {t} = useTranslation()
  const appContex = useAppContext()
  const modalArguments:IApplicationModalProps = props.isBottomSheet?appContex.bottomSheetArguments:appContex.modalArguments

  const [showTextField, setShowTextField] = useState<boolean>(false)

  const filteredCvs = modalArguments.cvs.filter(f=> f.moderationStatus === 'approved'&&f.published===true&&!modalArguments.vacancy.applicationsByCurrentUser.find(ap => ap.cvId === f.id))

  const submit = (data: {vacancyId: number, cvId: number, coverLetter: string}) => {
    if(!data.cvId) {
      appContex.showSnackbar(t('application_setCv'), SnackbarType.error)
      return
    }
    ApplicationRepository.sendApplication(data as IApplication)
    .then(_=> {
      modalArguments.onSet()
      appContex.showModal<IApplicationSuccessModalProps>(ModalType.ApplicationSuccessModal, {type: 'cv', vacancy: modalArguments.vacancy})
    })
  }

  const formik = useFormik<{vacancyId: number, cvId: number, coverLetter: string}>({
    initialValues: {
      vacancyId: modalArguments.vacancy.id,
      cvId: filteredCvs.length === 1 ? filteredCvs[0].id : undefined,
      coverLetter: undefined
    },
    onSubmit: submit
  })

  const body = (
    <div className={styles.root} >
      <Button className={styles.closeButton} onClick={props.onClose}><CrossSvg/></Button>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          {filteredCvs.length > 1 &&
            <RadioListField 
            options={filteredCvs.map(cv => {return {value: cv.id, label: cv.categories[0].name }})} 
            name={'cvId'}/>
            ||
            <>
            <P styleType={['greyLight', 'small', 'w500']}>Резюме для отклика</P>
            <Spacer basis={8}/>
            <P styleType={['medium', 'w500']} useThemeColor>{filteredCvs[0].categories[0].name}</P>
            </>
          }
          {showTextField && 
            <TextAreaField areaClassname={styles.textArea} onChange={(e)=> formik.setFieldValue('coverLetter', e.target.value)} autoSize name={'coverLetter'}/>
          }
          {!showTextField && 
            <p className={styles.addCover} onClick={()=>setShowTextField(true)}><PlusSvg color={colors.blue} />{t('application_coverLetter')}</p>
          } 
        </Form>
      </FormikProvider>
      <Button styleType={['phoneWide']} disabled={!formik.values.cvId} className={styles.nextButton} onClick={formik.submitForm}>{t('continue')}</Button>
    </div>
  )

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          {body}
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}

    </ModalBody>
  </ModalLayout>)
}