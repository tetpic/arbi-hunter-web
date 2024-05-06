import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import EditPencilSvg from 'components/svg/EditPencilSvg'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import { useEffect, useRef } from 'react'
import styles from './index.module.scss'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import { colors } from 'styles/variables'

interface Props {
  onClose: ()=> void
  onRemove: ()=>void
  onEdit: ()=> void
}

export default function ManagerDropdownMenu(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light
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
    <P onClick={onEditHandler} styleType={['alignCenter', 'w500', 'medium']}  useThemeColor className={styles.drpButton}><EditPencilSvg color={isLightTheme&&colors.black}/> {t('managers_editProfile')}</P>
    <P onClick={props.onRemove} styleType={['alignCenter', 'w500', 'medium']} useThemeColor className={styles.drpButton}><TrashBasketSvg/> {t('managers_removeProfile')}</P>
  </div>)
}