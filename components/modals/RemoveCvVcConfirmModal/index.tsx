import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import { useAppContext } from 'context/state'
import ClosingTitle from '@/components/ui/ClosingTitle'
import Button from '@/components/ui/Button'
import P from '@/components/ui/P'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'

interface Props {
  onClose?: () => void
  isBottomSheet?: boolean
}

export interface RemoveCvVcConfirmModalArgs {
  onRemove: () => void,
  onArchive?: () => void
  title: string 
  text: string 
  removeText?: string
  archiveText?: string
} 

export default function RemoveCvVcConfirmModal(props: Props) {
  const appContext = useAppContext()
  const args : RemoveCvVcConfirmModalArgs = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments

  const body=(
    <div className={styles.root}>
      <ClosingTitle classNames={{wrapper:styles.closingTitle}} onClose={props.onClose} title={args.title}/>
      <P useThemeColor styleType={['small', 'w500']}>{args.text}</P>
      <div className={styles.buttonsWrapper}>
        <Button styleType={['gradient', 'wide']} onClick={args.onRemove}>{args.removeText}</Button>
        {args.onArchive &&
        <Button styleType={['grey', 'wide', 'whiteText']} altStyleType={['white', 'wide']} onClick={args.onArchive}>{args.archiveText}</Button>
        }
      </div>
    </div>
  )

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          {body}
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }
 
  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}