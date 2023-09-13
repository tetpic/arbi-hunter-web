import RichTextField from 'components/fields/RichTextField'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import Button from 'components/ui/Button'
import Title from 'components/ui/TitleForSection'
import { usePatternContext } from 'context/pattern_state'
import { useAppContext } from 'context/state'
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
}

export default function ProposalTextModal(props: Props) {
  const appContext = useAppContext()
  const patternContext = usePatternContext()
  const modalArguments = appContext.modalArguments as {type: ApplicationBSSelectType, id?: number, body: [cv: ICV, id: number]}
  const [cv, vcId] = modalArguments.body


  const initialPattern = [...patternContext.patterns.values()].find(el=> {
    return el.type === (modalArguments.type === ApplicationBSSelectType.Reject?PatternTypes.Rejection:PatternTypes.Interview)
  })
  const [pattern, setPattern] = useState<IPattern>(initialPattern)
  // const [loading, setIsLoading] = useState<boolean>(true)

  const submit = (data: IProposal) => {
    
  }

  useEffect(()=>{
    setPattern(pattern)
  }, [])

  const initialValues = {
    type: modalArguments.type === ApplicationBSSelectType.Reject?ProposalRequestType.Rejection:ProposalRequestType.Interview,
    cvId: cv.id,
    vacancyId: vcId,
    coverLetter: pattern?pattern.template:''
  }

  const formik = useFormik<IProposal>({
    initialValues,
    onSubmit: submit
  })

  const setPatternHandler = (p: IPattern) => {
    setPattern(p)
  }

  const body = (
    <>
      <div className={styles.patterns}>
      {[...patternContext.patterns.values()].map(el=> {
        return <p className={styles.choosePattern} onClick={()=>setPatternHandler(el)}>{TranslatePatternType(el.type)}</p>
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

  return (
    <ModalLayout className={styles.layout}>
      <ModalBody>
        <Title className={styles.title} title={modalArguments.type === ApplicationBSSelectType.Reject?'Отказ': 'Приглашение'} showButton onBackClick={props.onClose} />
        {body}


      </ModalBody>
    </ModalLayout>
  )
}