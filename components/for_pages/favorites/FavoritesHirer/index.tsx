import Title from '@/components/ui/TitleForSection'
import styles from './index.module.scss'
import Button from '@/components/ui/Button'
import PlusSvg from '@/components/svg/PlusSvg'
import SettingSvg from '@/components/svg/SettingSvg'
import { useEffect, useState } from 'react'
import ItemNavigation from '@/components/ui/ItemNavigation'
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'
import { useFavoritesFolderContext } from 'context/favorites_folder_state'
import FavoritesHirerFolder from './Folder'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { AddFavoritesFolderArgs } from '@/components/modals/AddFavoritesFolder'
import { FavoritesSettingModalArgs } from '@/components/modals/FavoritesSettingModal'
import { useUserContext } from 'context/user_state'

interface Props {
}

enum FavoritesPage {
  RESUMES='resumes',
  // SEARCHES = 'searches',
}

const pageItems = (t: Translate) =>{
  return Object.values(FavoritesPage).map(el=> {return {name: t(`favorites_${el}`), type: el}})
} 


export default function FavoritesPageHirer(props: Props) {
  const [page, setPage] = useState<FavoritesPage>(FavoritesPage.RESUMES)
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const userContext = useUserContext()
  const foldersContext = useFavoritesFolderContext()
  const {t} = useTranslation()

  const openAddFolderModal = () => {
    const _modalArgs:AddFavoritesFolderArgs = {
      onSave: (data) => foldersContext.createNewFolder(data),
    }
    isTabletWidth
    ?appContext.showBottomSheet<AddFavoritesFolderArgs>(ModalType.AddFavoritesFolder, _modalArgs, 340)
    :appContext.showModal<AddFavoritesFolderArgs>(ModalType.AddFavoritesFolder, _modalArgs)
  }

  const openSettingsModal = () => {
    const _modalArgs:FavoritesSettingModalArgs = {
      initialFolders: foldersContext.allFolders,
      initialData: {
        addSavedToDefaultFolder: userContext.currentProfile.addSavedToDefaultFolder,
        defaultFolderId: foldersContext.allFolders.find(el=> el.default)?.id
      },
      onSave: (data) => {
        foldersContext.setSettings(data)
      }
    }

    isTabletWidth
    ?appContext.showBottomSheet<FavoritesSettingModalArgs>(ModalType.FavoritesSettingModal, _modalArgs, 424)
    :appContext.showModal<FavoritesSettingModalArgs>(ModalType.FavoritesSettingModal, _modalArgs)
  }

  useEffect(()=>{
    foldersContext.getAllFolders()
  }, [])

  const titleButtons = (
    <div className={styles.buttonsWrapper}>
      <Button styleType={['grey', 'icon']} onClick={openAddFolderModal}><PlusSvg/> {t('favorites_add')}</Button>
      <Button styleType={['grey', 'icon']} onClick={openSettingsModal}><SettingSvg/> {t('favorites_settings')}</Button>
    </div>
  )

  return (<div className={styles.root}> 
    <Title title={t('favorites_title')} rightButton={titleButtons}/>
    <ItemNavigation activeItem={page} items={pageItems(t)} onClick={setPage}/>
    {foldersContext.allFolders.sort((a)=> a.default?-1:1).map((el, index) => {
      return <FavoritesHirerFolder folder={el} key={el.id} initialActive={index===0}/>
    })}
  </div>)
}