import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import { RemoveScroll } from 'react-remove-scroll'
import Sheet from 'react-modal-sheet'
import { ModalType } from 'types/enums'
import ProposalModal from 'components/modals/ProposalModal'
import CvVcOptionsModal from 'components/modals/OptionsModal'
import VcResponsesFilterModal from 'components/modals/VcResponsesFilterModal'
import MediaItemActionsModal from 'components/modals/MediaItemActionsModal'
import ChatsFolderModal from 'components/modals/ChatsFolderModal'
import ChatFilterModal from 'components/modals/ChatFilterModal'


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
          isOpen={appContext.bottomSheet == ModalType.CvVcOptionsModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||400]}
          disableDrag={appContext.modalNonSkippable}
        >
          <CvVcOptionsModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
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
          snapPoints={[appContext.snapPoints|0.9]}
          disableDrag={appContext.modalNonSkippable}
        >
          <ChatFilterModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
      </div>
    </RemoveScroll>
  )
}



