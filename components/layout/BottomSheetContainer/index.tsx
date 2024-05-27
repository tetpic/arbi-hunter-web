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
import CompensationModal from '@/components/modals/CompensationModal'
import CharacterCartModal from '@/components/modals/CharacterCartModal'
import PurchasePreviewModal from '@/components/modals/PurchasePreviewModal'
import RefillBalanceModal from '@/components/modals/RefillBalanceModal'
import ChangeLanguageModal from '@/components/modals/ChangeLanguageModal'
import HirerFieldsModal from '@/components/modals/HirerFieldsModal'
import SalaryModal from '@/components/modals/SalaryModal'
import FavoritesSettingModal from '@/components/modals/FavoritesSettingModal'
import AddFavoritesFolder from '@/components/modals/AddFavoritesFolder'
import ChooseFolderToSave from '@/components/modals/ChooseFolderToSave'
import RemoveMessageConfirmModal from '@/components/modals/RemoveMessageConfirmModal'
import RemoveCvVcConfirmModal from '@/components/modals/RemoveCvVcConfirmModal'
import ChangeChatFolderModal from '@/components/modals/ChangeChatFolderModal'
import ConfirmModal from '@/components/modals/ConfirmModal'
import BuyOpensModal from '@/components/modals/BuyOpensModal'


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
          disableScrollLocking
        >
          <ProposalModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.OptionsModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||400]}
          disableDrag={appContext.modalNonSkippable}
          disableScrollLocking
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
          disableScrollLocking
        >
          <SpecializationModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.SourcesModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
          disableScrollLocking
        >
          <SoursesModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.LanguageModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
          disableScrollLocking
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
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.CompensationModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
        >
          <CompensationModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.CharacterCartModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
        >
          <CharacterCartModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.PurchasePreviewModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={appContext.modalNonSkippable}
        >
          <PurchasePreviewModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.RefillBalanceModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
        >
          <RefillBalanceModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.ChangeLanguageModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
        >
          <ChangeLanguageModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.HirerFieldsModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
          disableScrollLocking
        >
          <HirerFieldsModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.SalaryModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
          disableScrollLocking
        >
          <SalaryModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.FavoritesSettingModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
          disableScrollLocking
        >
          <FavoritesSettingModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.AddFavoritesFolder}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
          disableScrollLocking
        >
          <AddFavoritesFolder isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.ChooseFolderToSave}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
          disableScrollLocking
        >
          <ChooseFolderToSave isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.RemoveMessageConfirmModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
          disableScrollLocking
        >
          <RemoveMessageConfirmModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.RemoveCvVcConfirmModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
          disableScrollLocking
        >
          <RemoveCvVcConfirmModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.ChangeChatFolderModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
          disableScrollLocking
        >
          <ChangeChatFolderModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.ConfirmModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
          disableScrollLocking
        >
          <ConfirmModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
        <Sheet
          isOpen={appContext.bottomSheet == ModalType.BuyOpensModal}
          onClose={appContext.hideBottomSheet}
          snapPoints={[appContext.snapPoints||0.5]}
          disableDrag={false}
          disableScrollLocking
        >
          <BuyOpensModal isBottomSheet={true} onClose={appContext.hideBottomSheet}/>
        </Sheet>
      </div>
    </RemoveScroll>
  )
}



