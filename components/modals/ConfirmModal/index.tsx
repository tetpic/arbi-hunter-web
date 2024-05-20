import styles from './index.module.scss'
import P from '@/components/ui/P'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: ()=>void
}

export interface IConfirmModalProps {
  text: string, 
  callback: Function
  maxWidth?: number
}

export default function ConfirmModal(props: Props) {
  const appContext = useAppContext()
  const {t} = useTranslation()
  const modalArguments = appContext.modalArguments as IConfirmModalProps 

  const onTrueClickHandler = () => {
    modalArguments.callback()
    appContext.hideModal()
  }

  const body = (
    <div className={styles.modalBody} style={{maxWidth: modalArguments.maxWidth}}>
      <P styleType={['medium', 'w500']} useThemeColor>{modalArguments.text}</P>
      <div className={styles.buttonsWrapper}>
        <Button styleType={['gradient', 'wide']} onClick={onTrueClickHandler}>{t('yes')}</Button>
        <Button styleType={['grey', 'wide']} altStyleType={['white', 'wide']}  onClick={props.onClose}>{t('no')}</Button>
      </div>
    </div>
  )

  return (
    <ModalLayout className={styles.modalLayout} >
      <ModalBody >
        {body}
      </ModalBody>
    </ModalLayout>
  )
}