import RadioListField from 'components/fields/RadioListField'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import Button from 'components/ui/Button'
import ClosingTitle from 'components/ui/ClosingTitle'
import Spinner from 'components/ui/Spinner'
import { useAppContext } from 'context/state'
import { IApplication } from 'data/interfaces/IApplication'
import { ICV } from 'data/interfaces/ICV'
import { Form, FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import { ApplicationBSSelectType, ModalType, SnackbarType } from 'types/enums'
import { TranslateApplicationBSSelectType } from 'utils/enumsTranslations'
import styles from './index.module.scss'
import { IProposalTextModalProps } from './ProposalTextModal'
import { IVacancy } from 'data/interfaces/IVacancy'


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
}

export default function ProposalModal(props: Props) {
  const appContext = useAppContext()
  const modalArguments: IProposalModalProps = props.isBottomSheet?appContext.bottomSheetArguments: appContext.modalArguments 
  const [page, setPage] = useState<ProposalModalPager>(modalArguments.page||ProposalModalPager.Invite)
  const [loading, setIsLoading] = useState<boolean>(false)


  const submit = (data: FormikState) => {
    if(!data.vcId) {
      appContext.showSnackbar('Выберите вакансию', SnackbarType.error)
      return
    }
    if(data.type === ApplicationBSSelectType.AnotherVacancy && page === ProposalModalPager.Invite) {
      setPage(ProposalModalPager.OtherVacancy)
    }
    else {
      appContext.showModal<IProposalTextModalProps>(ModalType.ProposalTextModal, {...data, cv: modalArguments.cv, application: modalArguments.application, onSubmit: modalArguments.fn})
    }
  }

  const formik = useFormik<FormikState>({
    initialValues: {
      type: modalArguments.application?ApplicationBSSelectType.ThisVacancy:ApplicationBSSelectType.AnotherVacancy,
      vcId: modalArguments.application?.vacancyId||null,
    },
    onSubmit: submit
  })

  const title = (<ClosingTitle title={'Пригласить'} classNames={{wrapper: styles.titleWrapper}} onClose={props.onClose}/>)

  const body = (
    <FormikProvider value={formik} >
      <Form>
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
        page === ProposalModalPager.OtherVacancy && !loading &&
          <RadioListField 
          wrapperClassName={styles.radioWrapper} 
          name={'vcId'} 
          options={modalArguments.activeVacancies.filter(el=> modalArguments.cv.proposalByCurrentUser?.vacancyId !== el.id)
          .map(el => {
            return {value: el.id, label: el.name}
          })}/>          
        ||
        loading && <Spinner size={24}/>
        }
        <Button type='button' onClick={formik.submitForm} className={styles.buttonGradient}>Продолжить</Button>
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