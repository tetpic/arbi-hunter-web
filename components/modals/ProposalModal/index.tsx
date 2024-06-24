import styles from './index.module.scss'

import RadioListField from 'components/fields/RadioListField'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import Button from 'components/ui/Button'
import ClosingTitle from 'components/ui/ClosingTitle'
import { useAppContext } from 'context/state'
import { IApplication } from 'data/interfaces/IApplication'
import { ICV } from 'data/interfaces/ICV'
import { Form, FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import { ApplicationBSSelectType, ModalType, SnackbarType } from 'types/enums'
import { TranslateApplicationBSSelectType } from 'utils/enumsTranslations'
import { IProposalTextModalProps } from './ProposalTextModal'
import { IVacancy } from 'data/interfaces/IVacancy'
import useTranslation from 'next-translate/useTranslation'
import { IProposal } from 'data/interfaces/IProposal'


interface Props {
  onClose: ()=> void
  isBottomSheet?: boolean
}

interface FormikState {
  type: ApplicationBSSelectType
  vcId?: number
}

export enum ProposalModalPager {
  Invite,
  OtherVacancy
}

export interface IProposalModalProps {
  application?:IApplication, 
  cv?: ICV, 
  page?: ProposalModalPager
  fn?: () => void
  activeVacancies?: IVacancy[]
  createProposal: (p: IProposal) => Promise<boolean | IProposal>

}

export default function ProposalModal(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const modalArguments: IProposalModalProps = props.isBottomSheet?appContext.bottomSheetArguments: appContext.modalArguments 
  const [page, setPage] = useState<ProposalModalPager>(modalArguments.page||ProposalModalPager.Invite)


  const submit = (data: FormikState) => {
    if(!data.vcId) {
      appContext.showSnackbar(t('proposalModal_chooseVc'), SnackbarType.error)
      return
    }
    if(data.type === ApplicationBSSelectType.AnotherVacancy && page === ProposalModalPager.Invite) {
      setPage(ProposalModalPager.OtherVacancy)
    }
    else {
      appContext.showModal<IProposalTextModalProps>(ModalType.ProposalTextModal, {
        ...data, 
        cv: modalArguments.cv, 
        application: modalArguments.application, 
        onSubmit: modalArguments.fn, 
        createProposal: modalArguments.createProposal
      })
    }
  }

  const formik = useFormik<FormikState>({
    initialValues: {
      type: modalArguments.application?ApplicationBSSelectType.ThisVacancy:ApplicationBSSelectType.AnotherVacancy,
      vcId: modalArguments.application?.vacancyId||null,
    },
    onSubmit: submit
  })

  const title = (<ClosingTitle title={t('proposalModal_invite')} classNames={{wrapper: styles.titleWrapper}} onClose={props.onClose}/>)

  const body = (
    <FormikProvider value={formik} >
      <Form className={styles.form}>
        {
        page === ProposalModalPager.Invite &&
          <RadioListField 
          wrapperClassName={styles.radioWrapper} 
          name={'type'} 
          options={Object.values(ApplicationBSSelectType)
          .map(el=> {
            return {value: el, label: TranslateApplicationBSSelectType(el)}
          })}/>
        ||
        page === ProposalModalPager.OtherVacancy &&
          <RadioListField 
          wrapperClassName={styles.radioWrapper} 
          name={'vcId'} 
          options={modalArguments.activeVacancies.filter(el=> modalArguments.cv.proposalByCurrentUser?.vacancyId !== el.id)
          .map(el => {
            return {value: el.id, label: el.name}
          })}/>          
        }
        <Button styleType={['gradient']} type='button' onClick={formik.submitForm} className={styles.buttonGradient}>{t('continue')}</Button>
      </Form>
    </FormikProvider>
  )

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout>
      <BottomSheetBody>
        {title}
        {body}
      </BottomSheetBody>
    </BottomSheetLayout>
    )
  }

  return (
    <ModalLayout className={styles.layout}>
      <ModalBody>
        {title}
        {body}
      </ModalBody>
    </ModalLayout>
  )
}