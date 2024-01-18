import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import { RemoveScroll } from 'react-remove-scroll'
import Sheet from 'react-modal-sheet'
import { ModalType } from 'types/enums'
import ProposalModal from 'components/modals/ProposalModal'
import OptionsModal from 'components/modals/OptionsModal'
import VcResponsesFilterModal from 'components/modals/VcResponsesFilterModal'
import MediaItemActionsModal from 'components/modals/MediaItemActionsModal'
import ChatsFolderModal from 'components/modals/ChatsFolderModal'
import ChatFilterModal from 'components/modals/ChatFilterModal'
import ResponseModal from 'components/modals/ResponseModal'
import SearchFilterModal from 'components/modals/SearchFilterModal'
import SpecializationModal from 'components/modals/CvModals/Specialization'
import SoursesModal from 'components/modals/CvModals/Sourses'
import LangaugesModal from 'components/modals/CvModals/Languages'
import ApplicationModal from 'components/modals/ApplicationModal'
import AddPortfolioModal from '@/components/modals/AddPortfolioModal'


interface Props { }

export default function BottomSheetContainer(props: Props) {
  const appContext = useAppContext()
  return (
    <RemoveScroll enabled={!!appContext.bottomSheet}>
      <div className={styles.root} aria-hidden='true'>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.ProposalModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[400]}
          disableDrag={appContext.modalNonSkippable}
        >
          <ProposalModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.OptionsModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||400]}
          disableDrag={appContext.modalNonSkippable}
        >
          <OptionsModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.VcResponsesFilterModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[0.9]}
          disableDrag={appContext.modalNonSkippable}
        >
          <VcResponsesFilterModal  onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.MediaItemActionsModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[400]}
          disableDrag={appContext.modalNonSkippable}
        >
          <MediaItemActionsModal isBottomSheet={true}  onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.ChatsFolderModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[0.9]}
          disableDrag={appContext.modalNonSkippable}
        >
          <ChatsFolderModal isBottomSheet={true}  onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.ChatFilterModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.9]}
          disableDrag={appContext.modalNonSkippable}
        >
          <ChatFilterModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.ResponseModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
        >
          <ResponseModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.SearchFilterModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
        >
          <SearchFilterModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.SpecializationModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
        >
          <SpecializationModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.SourcesModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
        >
          <SoursesModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.LanguageModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
        >
          <LangaugesModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.ApplicationModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
        >
          <ApplicationModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.AddPortfolioModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
        >
          <AddPortfolioModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
      </div>
    </RemoveScroll>
  )
}



