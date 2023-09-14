import RichTextField from 'components/fields/RichTextField'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
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
import { ApplicationBSSelectType, PatternTypes, ProposalRequestType } from 'types/enums'
import { TranslatePatternType } from 'utils/enumsTranslations'
import styles from './index.module.scss'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export default function ProposalTextModal(props: Props) {
  const appContext = useAppContext()
  const modalArguments = appContext.modalArguments as {type: ApplicationBSSelectType, vcId?: number, application: IApplication, cv: ICV}
  const patternContext = usePatternContext()
  const proposalRepository = useFeedbacksContext()
  const {application, cv, vcId} = modalArguments

  const initialPattern = [...patternContext.patterns.values()].find(el=> {
    return el.type === (modalArguments.type === ApplicationBSSelectType.Reject?PatternTypes.Rejection:PatternTypes.Interview)
  })
  const [pattern, setPattern] = useState<IPattern>(initialPattern)

  const submit = (data: IProposal) => {
    proposalRepository.createProposal(data)
    .then(res=>res&&props.onClose())
  }

  useEffect(()=>{
    setPattern(pattern)
  }, [])

  const initialValues = {
    type: modalArguments.type === ApplicationBSSelectType.Reject?ProposalRequestType.Rejection:ProposalRequestType.Interview,
    cvId: cv.id||application?.cvId,
    vacancyId: vcId||application?.vacancyId,
    coverLetter: pattern?pattern.template:'',
    applicationId: application?.id||null
  }

  const formik = useFormik<IProposal>({
    initialValues,
    onSubmit: submit
  })

  const body = (
    <>
      <div className={styles.patterns}>
      {[...patternContext.patterns.values()].map(el=> {
        return <p className={styles.choosePattern} onClick={()=>setPattern(el)}>{TranslatePatternType(el.type)}</p>
      })}
      </div>
      <FormikProvider value={formik} >
        <Form className={styles.form}>
            <RichTextField name={'coverLetter'} value={pattern?.template}/>
          <Button className={styles.buttonYellow} type='button' onClick={formik.submitForm}>Отправить</Button>
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
    <ModalLayout className={styles.layout}>
      <ModalBody>
        <Title className={styles.title} title={modalArguments.type === ApplicationBSSelectType.Reject?'Отказ': 'Приглашение'} showButton onBackClick={props.onClose} />
        {body}
      </ModalBody>
    </ModalLayout>
  )
}