import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import EditPencilSvg from 'components/svg/EditPencilSvg'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import IconButton from 'components/ui/IconButton'
import { useEffect, useRef } from 'react'
import styles from './index.module.scss'

interface Props {
  onClose: ()=> void
  onRemove: ()=>void
  onEdit: ()=> void
}

export default function ManagerDropdownMenu(props: Props) {
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
    <IconButton onClick={onEditHandler} bgColor={'transparent'} className={styles.drpButton}><EditPencilSvg/> Редактировать профиль</IconButton>
    <IconButton onClick={props.onRemove} bgColor={'transparent'} className={styles.drpButton}><TrashBasketSvg/> Удалить профиль</IconButton>
  </div>)
}