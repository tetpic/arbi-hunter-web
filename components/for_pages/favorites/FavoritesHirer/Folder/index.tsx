import { IFolder } from 'data/interfaces/IFolder'
import styles from './index.module.scss'
import Button from '@/components/ui/Button'
import ArrowDownSvg from '@/components/svg/ArrowDownSvg'
import P from '@/components/ui/P'
import { useFavoritesFolderContext } from 'context/favorites_folder_state'
import CvItem from '@/components/ui/CvItem'
// import SortArrowsSvg from '@/components/svg/SortArrowsSvg'
import { useRef, useState } from 'react'
import classnames from 'classnames'
import Accordeon from '@/components/ui/Accordeon'
import Spacer from '@/components/ui/Spacer'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton'
import OptionsList from '@/components/ui/OptionsList'
import OptionsDropDown from '@/components/ui/OptionsDropDown'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import { useAppContext } from 'context/state'
import { AddFavoritesFolderArgs } from '@/components/modals/AddFavoritesFolder'
import { ModalType } from 'types/enums'
import { IConfirmModalProps } from '@/components/modals/ConfirmModal'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  folder: IFolder
  initialActive?: boolean
}

export default function FavoritesHirerFolder(props: Props) {
  const {t} = useTranslation()
  const foldersContext = useFavoritesFolderContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const [isActive, setIsActive] = useState<boolean>(props.initialActive||false) 
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)

  const editFolder = () => {
    const _modalArgs:AddFavoritesFolderArgs = {
      onSave: (data) => foldersContext.updateFolder(props.folder.id, data),
      initialData: {name: props.folder.name, default: props.folder.default}
    }
    isTabletWidth
    ?appContext.showBottomSheet<AddFavoritesFolderArgs>(ModalType.AddFavoritesFolder, _modalArgs, 340)
    :appContext.showModal<AddFavoritesFolderArgs>(ModalType.AddFavoritesFolder, _modalArgs)
  }

  const deletefolder = () => {
    appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, {
      text: t('favorites_confirmDeletion'),
      callback: () => foldersContext.deleteFolder(props.folder.id),
      maxWidth: 400
    })
  }

  const openDropdownHandler = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation()
    openDropDown(!dropDown)
  }


  const options = <OptionsList options={[
    {title: t('edit'), onClick: editFolder},
    props.folder.default?null:{title: t('delete'), onClick: deletefolder}
  ].filter(Boolean)} onMouseLeave={() => openDropDown(false)}/>


  return (<div className={styles.root}> 
    <div className={styles.top}  onClick={() => setIsActive(!isActive)}>
      <Button styleType={['backTransparent', 'icon']}><ArrowDownSvg className={classnames(styles.arrow, isActive&&styles.arrow_active)}/></Button>
      <div className={styles.folderDesc}>
        <P styleType={['w600', 'large']}>{props.folder.name}</P>
      </div>
      <ThreeDotsButton 
      className={styles.threeDots} 
      onMouseEnter={openDropdownHandler} 
      onClick={openDropdownHandler}
      />
      <OptionsDropDown 
      options={options} 
      active={dropDown} 
      getRef={  (r) => {dropRef.current = r}} 
      onClose={()=>openDropDown(false)}/>
    </div>
    <Spacer basis={16}/>
    <Accordeon isActive={isActive}>
      <div className={styles.stats}>
        <P>{foldersContext.currentFolderPage.get(props.folder.id)?.total} {t('cv1')}</P>
      </div>
      <div className={styles.cvsWrapper}>
        {foldersContext.cvsByFolderId.get(props.folder.id)?.map(el => {
          return el.cvs.map(cv => {
            return <CvItem cv={cv} onChangeItem={() => foldersContext.removeCvFromFolder(props.folder.id, cv.id)} key={cv.id}/>
          })
        })}
      </div>
    </Accordeon>
  </div>)
}