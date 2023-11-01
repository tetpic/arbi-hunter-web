import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import Modal from 'react-modal'
import { ModalType } from 'types/enums'
import classNames from 'classnames'
import { RemoveScroll } from 'react-remove-scroll'
import RegistrationModal from 'components/modals/RegistrationModal'
import SpecializationModal from 'components/modals/CvModals/Specialization'
import SkillsModal from 'components/modals/CvModals/Skills'
import LangaugesModal from 'components/modals/CvModals/Languages'
import SoursesModal from 'components/modals/CvModals/Sourses'
import ProposalModal from 'components/modals/ProposalModal'
import ProposalTextModal from 'components/modals/ProposalModal/ProposalTextModal'
import CvVcOptionsModal from 'components/modals/OptionsModal'
import ConfirmModal from 'components/modals/ConfirmModal'
import CongratulationsModal from 'components/modals/CongratulationsModal'
import CreateNewCommunityModal from 'components/modals/CreateNewCommunityModal'
import EditCommunityModal from 'components/modals/EditCommunityModal'
import CommunityNewsViewModal from 'components/modals/CommunityNewsViewModal'
import MediaItemActionsModal from 'components/modals/MediaItemActionsModal'
import CreateCommunityArticleModal from 'components/modals/CreateCommunityArticleModal'
import MembersModal from 'components/modals/MembersModal'
import DetailsModal from 'components/modals/DetailsModal'
import ChatsFolderModal from 'components/modals/ChatsFolderModal'
import AddPortfolioModal from 'components/modals/AddPortfolioModal'
import StoriesViewerModal from 'components/modals/StoriesViewerModal'
// import SpecializationModal from 'components/modals/CvModal'
// import CvModal from 'components/modals/CvModal'


interface Props { }

export default function ModalContainer(props: Props) {
  const appContext = useAppContext()
  const commonSettings = {
    onRequestClose: appContext.hideModal,
    className: styles.modal,
    overlayClassName: classNames([styles.overlay, appContext.modal && styles[appContext.modal]]),
  }

  const currentModal = ((): JSX.Element=>{
    switch(appContext.modal) {
      case ModalType.RegistrationModal:
        return <Modal isOpen {...commonSettings}>
           <RegistrationModal/>
        </Modal>
      case ModalType.SpecializationModal: 
        return <Modal isOpen {...commonSettings}>
          <SpecializationModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.SkillsModal:
        return <Modal isOpen {...commonSettings}>
          <SkillsModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.LanguageModal:
        return <Modal isOpen {...commonSettings}>
          <LangaugesModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.SourcesModal:
        return <Modal isOpen {...commonSettings}>
          <SoursesModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.CvVcOptionsModal:
        return <Modal isOpen {...commonSettings}>
          <CvVcOptionsModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.ProposalModal:
        return <Modal isOpen {...commonSettings}>
          <ProposalModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.ProposalTextModal:
        return <Modal isOpen {...commonSettings}>
          <ProposalTextModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.ConfirmModal:
        return <Modal isOpen {...commonSettings}>
          <ConfirmModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.CongratulationsModal:
        return <Modal isOpen {...commonSettings}>
          <CongratulationsModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.CreateNewCommunityModal:
        return  <Modal isOpen {...commonSettings}>
          <CreateNewCommunityModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.EditCommunityModal:
        return  <Modal isOpen {...commonSettings}>
          <EditCommunityModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.CommunityNewsViewModal:
        return  <Modal isOpen {...commonSettings}>
          <CommunityNewsViewModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.MediaItemActionsModal:
        return  <Modal isOpen {...commonSettings}>
          <MediaItemActionsModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.CreateCommunityArticleModal:
        return  <Modal isOpen {...commonSettings}>
          <CreateCommunityArticleModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.MembersModal:
        return  <Modal isOpen {...commonSettings}>
          <MembersModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.DetailsModal:
        return <Modal isOpen {...commonSettings}>
          <DetailsModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.ChatsFolderModal:
        return <Modal isOpen {...commonSettings}>
          <ChatsFolderModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.AddPortfolioModal:
        return <Modal isOpen {...commonSettings}>
          <AddPortfolioModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.StoriesViewerModal:
        return <Modal isOpen {...commonSettings}>
          <StoriesViewerModal onClose={commonSettings.onRequestClose}/>
        </Modal>


    }
  })()

  return (
    <RemoveScroll enabled={!!appContext.modal}>
      <div aria-hidden="true">
        {/* <Modal isOpen={appContext.modal === ModalType.RegistrationModal} {...commonSettings}>
          {appContext.modal === ModalType.RegistrationModal && <RegistrationModal/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.SpecializationModal} {...commonSettings}>
          {appContext.modal === ModalType.SpecializationModal && <SpecializationModal onClose={commonSettings.onRequestClose}/>}
        </Modal> */}
        {currentModal}
        {/* <Modal isOpen={appContext.modal === ModalType.SkillsModal} {...commonSettings}>
          {appContext.modal === ModalType.SkillsModal && <SkillsModal onClose={commonSettings.onRequestClose}/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.LanguageModal} {...commonSettings}>
          {appContext.modal === ModalType.LanguageModal && <LangaugesModal onClose={commonSettings.onRequestClose}/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.SourcesModal} {...commonSettings}>
          {appContext.modal === ModalType.SourcesModal && <SoursesModal onClose={commonSettings.onRequestClose}/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.CvVcOptionsModal} {...commonSettings}>
          {appContext.modal === ModalType.CvVcOptionsModal && <CvVcOptionsModal onClose={commonSettings.onRequestClose}/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.ProposalModal} {...commonSettings}>
          {appContext.modal === ModalType.ProposalModal && <ProposalModal onClose={commonSettings.onRequestClose}/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.ProposalTextModal} {...commonSettings}>
          {appContext.modal === ModalType.ProposalTextModal && <ProposalTextModal onClose={commonSettings.onRequestClose}/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.ConfirmModal} {...commonSettings}>
          {appContext.modal === ModalType.ConfirmModal && <ConfirmModal onClose={commonSettings.onRequestClose}/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.CongratulationsModal} {...commonSettings}>
          {appContext.modal === ModalType.CongratulationsModal && <CongratulationsModal onClose={commonSettings.onRequestClose}/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.CreateNewCommunityModal} {...commonSettings}>
          {appContext.modal === ModalType.CreateNewCommunityModal && <CreateNewCommunityModal onClose={commonSettings.onRequestClose}/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.EditCommunityModal} {...commonSettings}>
          {appContext.modal === ModalType.EditCommunityModal && <EditCommunityModal onClose={commonSettings.onRequestClose}/>}
        </Modal> */}
      </div>
    </RemoveScroll>
  )
}

