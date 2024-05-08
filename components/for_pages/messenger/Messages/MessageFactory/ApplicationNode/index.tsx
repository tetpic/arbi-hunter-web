import { IApplication } from 'data/interfaces/IApplication'
import styles from './index.module.scss'
import { ApplicationBSSelectType, ModalType, SnackbarType } from 'types/enums'
import { IProposalTextModalProps } from 'components/modals/ProposalModal/ProposalTextModal'
import { useAppContext } from 'context/state'
import Button from 'components/ui/Button'
import Spacer from 'components/ui/Spacer'
import { IMessage } from 'data/interfaces/IChat'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useChatDialogContext } from 'context/chat_dialog_state'
import { IProposal } from 'data/interfaces/IProposal'
import { IResponseModalProps } from 'components/modals/ResponseModal'
import PlusSvg from 'components/svg/PlusSvg'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  application?: IApplication
  message?: IMessage
  profileType?: ProfileType
}

export  function ApplicationHirerNode (props: Props) {
  const appContext = useAppContext()
  const {t} = useTranslation()

  return (<>
    <Button 
    styleType={['grey']}
    altStyleType={['white']}
    onClick={()=>{
      appContext.showModal<IProposalTextModalProps>(ModalType.ProposalTextModal, 
        {type: ApplicationBSSelectType.ThisVacancy, 
          application: props.application, 
          cv: props.application?.cv, 
          vcId: props.application?.vacancyId,
        })
    }} 
   
    >
      {t('cv_item_invite')}
     </Button>
      
    <Button 
    styleType={['grey']}
    altStyleType={['white']}
    onClick={()=>{
      appContext.showModal<IProposalTextModalProps>(ModalType.ProposalTextModal, {type: ApplicationBSSelectType.Reject, application: props.application, cv: props.application.cv, vcId: props.application.vacancyId})
    }} 
    >
      {t('cv_item_reject')}
    </Button>
  </>)
}

export function ApplicationEmployeeNode (props: Props) {
  const appContext = useAppContext()
  const dialogContext = useChatDialogContext()
  const {isTabletWidth} = appContext.size
  const {t} = useTranslation()


  const makeCoverLetter = () => {
    if(props.application.cvDeletedOrHidden) {
      appContext.showSnackbar(t('cv_item_removerOrHidden'), SnackbarType.error)
      return
    }
    const onSubmit = (msg: IProposal) => {
      dialogContext.refreshMessage(Number(props.message.id), {...props.message, application: msg})
    }
    const modalProps = {cv: props.application?.cv, application: props.application, onSubmit}
    isTabletWidth
    ?appContext.showBottomSheet<IResponseModalProps>(ModalType.ResponseModal, {...modalProps})
    :appContext.showModal<IResponseModalProps>(ModalType.ResponseModal, {...modalProps})
  }



  return (<>
  <p className={styles.message}>{t('chat_vacancyApplication')}</p>
  <Spacer basis={8} />
  <p className={styles.message}>
    {props.message?.application?.coverLetter}
    {!props.message?.application?.coverLetter&&props.profileType === ProfileType.Hirer&&
      <span>{t('chat_withoutCoverLetter')}</span>
    }
  </p>
  {!props.message?.application?.coverLetter && props.profileType === ProfileType.Employee &&
    <p className={styles.cover} onClick={makeCoverLetter}>
      <PlusSvg/>
      {t('chat_coverLetter')}
    </p>
  }
  </>)
}