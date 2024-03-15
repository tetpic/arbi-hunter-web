import classNames from 'classnames'
import styles from './index.module.scss'

import RichTextField from 'components/fields/RichTextField'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { IApplicationSuccessModalProps } from 'components/modals/ApplicationSuccessModal'
import Button from 'components/ui/Button'
import Title from 'components/ui/TitleForSection'
import { useFeedbacksContext } from 'context/feedbacks_state'
import { usePatternContext } from 'context/pattern_state'
import { useAppContext } from 'context/state'
import { IApplication } from 'data/interfaces/IApplication'
import { ICV } from 'data/interfaces/ICV'
import { IPattern } from 'data/interfaces/IPattern'
import { IProposal } from 'data/interfaces/IProposal'
import { Form, FormikProvider, useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { ApplicationBSSelectType, ModalType, PatternTypes, ProposalRequestType, SnackbarType } from 'types/enums'
import { TranslatePatternType } from 'utils/enumsTranslations'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export interface IProposalTextModalProps {
  type: ApplicationBSSelectType, 
  vcId?: number, 
  application?: IApplication, 
  cv: ICV,
  onSubmit?: () => void
}

export default function ProposalTextModal(props: Props) {
  const appContext = useAppContext()
  const modalArguments = appContext.modalArguments as IProposalTextModalProps
  const {application, cv, vcId} = modalArguments
  const patternContext = usePatternContext()
  const proposalRepository = useFeedbacksContext()
  const [pattern, setPattern] = useState<IPattern>(null)

  const submit = async(data: IProposal) => {
    proposalRepository.createProposal(data)
    .then(res=>{
      res
      if(typeof res === 'object' && modalArguments.onSubmit) {
        modalArguments.onSubmit()
      }
      res&&appContext.showModal<IApplicationSuccessModalProps>(ModalType.ApplicationSuccessModal, {type: 'vc', id: vcId})
      if(!res){
        throw Error()
      }
    })
    .catch(err=>{
      appContext.showSnackbar(`Невозможно отправить ${pattern.type === PatternTypes.Rejection?'отказ': 'приглашение'}. Вакансия или резюме удалено или не опубликовано`, SnackbarType.error)
    })
  }


  const initialValues = {
    type: modalArguments.type === ApplicationBSSelectType.Reject?ProposalRequestType.Rejection:ProposalRequestType.Interview,
    cvId: cv?.id||application?.cvId,
    vacancyId: vcId||application?.vacancyId,
    coverLetter: pattern?pattern.template:'',
    applicationId: application?.id||null
  }

  const formik = useFormik<IProposal>({
    initialValues,
    onSubmit: submit
  })


  useEffect(()=>{
    if(patternContext.patterns) {
      const initialPattern = [...patternContext.patterns.values()].find(el=> {
        return el.type === (modalArguments.type === ApplicationBSSelectType.Reject?PatternTypes.Rejection:PatternTypes.Interview)
      })
      setPattern(initialPattern)
      formik.setFieldValue('coverLetter', initialPattern?.template||'')
    }
  }, [patternContext.patterns])

  useEffect(()=>{
    patternContext.setPatterns()
  }, [])

  const body = (
    <>
      <div className={styles.patterns}>
      {[...patternContext.patterns.values()].map(el=> {
        return <p key={el.id} className={classNames(styles.choosePattern, pattern?.id === el.id&&styles.choosePattern_active)} onClick={()=>setPattern(el)}>{TranslatePatternType(el.type)}</p>
      })}
      </div>
      <FormikProvider value={formik} >
        <Form className={styles.form}>
            <RichTextField name={'coverLetter'} key={pattern?.template} value={pattern?.template}/>
          <Button className={styles.buttonGradient} type='button' onClick={formik.submitForm}>Отправить</Button>
        </Form>
      </FormikProvider>
    </>
  )

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
            <Title className={styles.title} title={modalArguments.type === ApplicationBSSelectType.Reject?'Отказ': 'Приглашение'} showButton onBackClick={props.onClose} />
            {body}
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }

  return (
    <ModalLayout mobileFullScreen className={styles.layout}>
      <ModalBody>
        <Title className={styles.title} title={modalArguments.type === ApplicationBSSelectType.Reject?'Отказ': 'Приглашение'} showButton onBackClick={props.onClose} />
        {body}
      </ModalBody>
    </ModalLayout>
  )
}