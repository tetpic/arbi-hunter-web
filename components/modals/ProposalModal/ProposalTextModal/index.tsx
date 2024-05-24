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
import { Form,  FormikProvider, useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { ApplicationBSSelectType,  ModalType,  ProposalRequestType, SnackbarType } from 'types/enums'
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
  onSubmit?: (type?: ProposalRequestType, text?: string) => void
}

export default function ProposalTextModal(props: Props) {
  const appContext = useAppContext()
  const modalArguments = appContext.modalArguments as IProposalTextModalProps
  const {application, cv, vcId} = modalArguments
  const patternContext = usePatternContext()
  const proposalRepository = useFeedbacksContext()
  const [pattern, setPattern] = useState<IPattern>(null)
  const [type, setTypeState] = useState<ProposalRequestType>(null)

  const submit = async(data: IProposal) => {
    
    const dataToSend:IProposal = {
      ...data,
      coverLetter: data.coverLetter,    
      type: type
    }
    proposalRepository.createProposal(dataToSend)
    .then(res=>{
      res
      if(typeof res === 'object' && modalArguments.onSubmit) {
        modalArguments.onSubmit(dataToSend.type, data.coverLetter)
      }
      res&&appContext.showModal<IApplicationSuccessModalProps>(ModalType.ApplicationSuccessModal, {type: 'vc', id: vcId, cv: modalArguments.cv})
      if(!res){
        throw Error()
      }
    })
    .catch(err=>{
      appContext.showSnackbar(`Невозможно отправить ${pattern.type === ProposalRequestType.Rejection?'отказ': 'приглашение'}. Вакансия или резюме удалено или не опубликовано`, SnackbarType.error)
    })
  }


  const initialValues = {
    type: modalArguments.type === ApplicationBSSelectType.Reject?ProposalRequestType.Rejection:ProposalRequestType.Interview,   
    cvId: cv?.id||application?.cvId,
    vacancyId: vcId||application?.vacancyId,
    coverLetter: '',
    applicationId: application?.id||null
  }

  const formik = useFormik<IProposal>({
    initialValues,
    onSubmit: submit
  })


  // useEffect(()=>{
  //   if(patternContext.patterns) {
  //     const initialPattern = [...patternContext.patterns.values()].find(el=> {
  //       return el.type === (modalArguments.type === ApplicationBSSelectType.Reject?ProposalRequestType.Rejection:ProposalRequestType.Interview)
  //     })
  //     setPattern(initialPattern)
  //     formik.setFieldValue('coverLetter', initialPattern?.template||'')
  //   }
  // }, [patternContext.patterns])

  const getRequestTypes = (): ProposalRequestType[] => {
    if(modalArguments.type === ApplicationBSSelectType.Reject) {
      return [ProposalRequestType.Rejection]
    }
    else {
      return [ProposalRequestType.InfoRequest,ProposalRequestType.Interview, ProposalRequestType.Consider]
    }
  }

  useEffect(()=>{
    patternContext.setPatterns()
    setTypeState(getRequestTypes()[0])
  }, [])

  useEffect(()=>{
    if(patternContext.patterns.size>0 && [...patternContext.patterns.values()].map(e=>e.type).includes(type)) {
      console.log([...patternContext.patterns.values()].find(el=>el.type === type))
      // formik.setFieldValue('coverLetter', [...patternContext.patterns.values()].find(el=>el.type === type).template)
      setPattern([...patternContext.patterns.values()].find(el=>el.type === type))
    }
  }, [patternContext.patterns, type])



  const body = (
    <>
      <div className={styles.patterns}>
      {getRequestTypes().map(el=> {
        return <p 
        key={el} 
        className={classNames(styles.choosePattern, type === el&&styles.choosePattern_active)} 
        onClick={()=>{
          setPattern([...patternContext.patterns.values()].find(pt => pt.type === el))
          setTypeState(el)
        }}>{TranslatePatternType(el)}</p>
      })}
      </div>
      <FormikProvider value={formik} >
        <Form className={styles.form}>
            <RichTextField name={'coverLetter'} key={type+pattern?.template} value={pattern?.template} className={styles.coverLetter}/>
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