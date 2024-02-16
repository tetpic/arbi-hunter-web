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
import MediaCategoryModal from 'components/modals/MediaCategoryModal'
import MobileSideBarModal from 'components/modals/MobileSideBarModal'
import ResponseModal from 'components/modals/ResponseModal'
import ImageViewerModal from 'components/modals/ImageViewerModal'
import ChatFilterModal from 'components/modals/ChatFilterModal'
import ConfirmModal from 'components/modals/ConfirmModal'
import CourseFeedbackModal from 'components/modals/CourseFeedbackModal'
import ApplicationModal from 'components/modals/ApplicationModal'
import ApplicationSuccessModal from 'components/modals/ApplicationSuccessModal'
import SearchFilterModal from 'components/modals/SearchFilterModal'
import AddPersonalBlockModal from 'components/modals/AddPersonalBlockModal'
import RecruitingFiltersModal from 'components/modals/RecruitingFiltersModal'
import CoursesCategoriesModal from 'components/modals/CoursesCategoriesModal'
import UserImageModal from 'components/modals/UserImageModal'
import BackgroundPickModal from 'components/modals/BackgroundPickModal'
import NewPasswordModal from 'components/modals/NewPasswordModal'
import ProfileTypeSwitcher from 'components/modals/ProfileTypeSwitcher'
import CompensationModal from '@/components/modals/CompensationModal'
import ChangeLanguageModal from '@/components/modals/ChangeLanguageModal'
import CountryModal from '@/components/modals/CountryModal'
import CityModal from '@/components/modals/CityModal'


interface Props { }

export default function ModalContainer(props: Props) {
  const appContext = useAppContext()
  const commonSettings = {
    onRequestClose: !appContext.modalArguments?.nonSkippable&&appContext.hideModal,
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
      case ModalType.OptionsModal:
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
      case ModalType.MediaCategoryModal:
        return <Modal isOpen {...commonSettings}>
          <MediaCategoryModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.MobileSideBarModal:
        return <Modal isOpen {...commonSettings}>
          <MobileSideBarModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.ResponseModal:
        return <Modal isOpen {...commonSettings}>
          <ResponseModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.ImageViewerModal:
        return <Modal isOpen {...commonSettings}>
          <ImageViewerModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.ChatFilterModal:
        return <Modal isOpen {...commonSettings}>
          <ChatFilterModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.CourseFeedbackModal:
        return <Modal isOpen {...commonSettings}>
          <CourseFeedbackModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.ApplicationModal:
        return <Modal isOpen {...commonSettings} >
          <ApplicationModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.ApplicationSuccessModal:
        return <Modal isOpen {...commonSettings} >
          <ApplicationSuccessModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.SearchFilterModal:
        return <Modal isOpen {...commonSettings} >
          <SearchFilterModal onClose={commonSettings.onRequestClose}/>
        </Modal>
      case ModalType.AddPersonalBlockModal:
        return <Modal isOpen {...commonSettings} >
        <AddPersonalBlockModal onClose={commonSettings.onRequestClose}/>
      </Modal>
      case ModalType.RecruitingFiltersModal:
        return <Modal isOpen {...commonSettings} >
        <RecruitingFiltersModal onClose={commonSettings.onRequestClose}/>
      </Modal>
      case ModalType.CoursesCategoriesModal:
        return <Modal isOpen {...commonSettings} >
        <CoursesCategoriesModal onClose={commonSettings.onRequestClose}/>
      </Modal>
      case ModalType.UserImageModal:
        return <Modal isOpen {...commonSettings} >
        <UserImageModal onClose={commonSettings.onRequestClose}/>
      </Modal>
      case ModalType.BackgroundPickModal:
        return <Modal isOpen {...commonSettings} >
        <BackgroundPickModal onClose={commonSettings.onRequestClose}/>
      </Modal>
      case ModalType.NewPasswordModal:
        return <Modal isOpen {...commonSettings} >
        <NewPasswordModal />
      </Modal>
      case ModalType.ProfileTypeSwitcher:
        return <Modal isOpen {...commonSettings} >
        <ProfileTypeSwitcher onClose={commonSettings.onRequestClose}/>
      </Modal>
      case ModalType.CompensationModal:
        return <Modal isOpen {...commonSettings} >
        <CompensationModal onClose={commonSettings.onRequestClose}/>
      </Modal>
      case ModalType.ChangeLanguageModal:
        return <Modal isOpen {...commonSettings} >
        <ChangeLanguageModal onClose={commonSettings.onRequestClose}/>
      </Modal>
      case ModalType.CountryModal:
        return <Modal isOpen {...commonSettings} >
        <CountryModal onClose={commonSettings.onRequestClose}/>
      </Modal>
      case ModalType.CityModal:
        return <Modal isOpen {...commonSettings} >
        <CityModal onClose={commonSettings.onRequestClose}/>
      </Modal>
    }
  })()

  return (
    <RemoveScroll enabled={!!appContext.modal}>
      <div aria-hidden="true">
        {currentModal}
      </div>
    </RemoveScroll>
  )
}

