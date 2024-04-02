import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import EditPencilSvg from 'components/svg/EditPencilSvg'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import { useEffect, useRef } from 'react'
import styles from './index.module.scss'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: ()=> void
  onRemove: ()=>void
  onEdit: ()=> void
}

export default function ManagerDropdownMenu(props: Props) {
  const {t} = useTranslation()
  const dropDownRef = useRef<HTMLDivElement>()
  const [isActive, setIsActive] = useDetectOutsideClick(dropDownRef, true)

  const onEditHandler = () => {
    props.onEdit()
    props.onClose()
  }

  useEffect(()=>{
    !isActive&&props.onClose() 
  }, [isActive]) 

  return ( 
  <div className={styles.dropDown} ref={dropDownRef}>
    <P onClick={onEditHandler} styleType={['alignCenter', 'w500', 'medium']} className={styles.drpButton}><EditPencilSvg/> {t('managers_editProfile')}</P>
    <P onClick={props.onRemove} styleType={['alignCenter', 'w500', 'medium']} className={styles.drpButton}><TrashBasketSvg/> {t('managers_removeProfile')}</P>
  </div>)
}