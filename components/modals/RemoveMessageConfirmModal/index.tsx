import { useAppContext } from 'context/state'
import styles from './index.module.scss'
import ModalLayout from '@/components/layout/Modal/ModalLayout'
import ModalBody from '@/components/layout/Modal/ModalBody'
import P from '@/components/ui/P'
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'

interface Props {
  onClose?: () => void
  isBottomSheet?: boolean
}

export interface RemoveMessageConfirmModalArgs {
  canRemoveForAll: boolean
  onSend?: (type: 'forAll'|'forMe') => void
}



export default function RemoveMessageConfirmModal(props: Props) {
  const appContext = useAppContext()
  const args:RemoveMessageConfirmModalArgs = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments
  const [deleteType, setDeleteType] = useState<'forAll'|'forMe'>()

  useEffect(()=>{
    if(deleteType) {
      args.onSend(deleteType)
    }
  }, [deleteType])


  const body = (
    <div className={styles.root}>
      <P useThemeColor styleType={['w500', 'small', 'textCenter']} >Вы действительно хотите удалить это сообщение?</P>
      <Button styleType={['grey', 'wide']} altStyleType={['white', 'wide']} onClick={()=>setDeleteType('forMe')}><P styleType={['red', 'w500']}>Удалить у меня</P></Button>
      {args.canRemoveForAll &&
       <Button styleType={['grey', 'wide' ]} altStyleType={['white', 'wide']}   onClick={()=>setDeleteType('forAll')}><P styleType={['red', 'w500']}>Удалить у всех</P></Button>
      }
      <Button styleType={['grey', 'blue', 'wide']} onClick={props.onClose}>Отмена</Button>
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