import UserCart from '@/components/for_pages/profile/userProfile/UserCart'
// import styles from './index.module.scss'
// import BottomSheetContainer from '@/components/layout/BottomSheetContainer'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'
import { ICharItem } from 'data/interfaces/ICharacter'
import { useAppContext } from 'context/state'

interface Props {
  isBottomSheet?: boolean
  onClose?: ()=>void
}

export interface CharacterCartModalArgs {
  choosenItems?: Map<number, ICharItem>
  onSave?: () => void
}

export default function CharacterCartModal(props: Props) {
  const args = useAppContext().bottomSheetArguments as CharacterCartModalArgs

  return (<BottomSheetLayout>
    <BottomSheetBody>
      <UserCart onSave={args.onSave} choosenItems={args.choosenItems}/>
    </BottomSheetBody>
  </BottomSheetLayout> 
  )
}