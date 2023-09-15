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

  return (
    <RemoveScroll enabled={!!appContext.modal}>
      <div aria-hidden="true">
        <Modal isOpen={appContext.modal === ModalType.RegistrationModal} {...commonSettings}>
          {appContext.modal === ModalType.RegistrationModal && <RegistrationModal/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.SpecializationModal} {...commonSettings}>
          {appContext.modal === ModalType.SpecializationModal && <SpecializationModal onClose={commonSettings.onRequestClose}/>}
        </Modal>
        <Modal isOpen={appContext.modal === ModalType.SkillsModal} {...commonSettings}>
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
      </div>
    </RemoveScroll>
  )
}

