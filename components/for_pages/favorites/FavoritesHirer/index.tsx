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

interface Props {
}

enum FavoritesPage {
  RESUMES='resumes',
  SEARCHES = 'searches',
}

const pageItems = (t: Translate) =>{
  return Object.values(FavoritesPage).map(el=> {return {name: t(`favorites_${el}`), type: el}})
} 



export default function FavoritesPageHirer(props: Props) {
  const [page, setPage] = useState<FavoritesPage>(FavoritesPage.RESUMES)
  const appContext = useAppContext()
  const foldersContext = useFavoritesFolderContext()
  const {t} = useTranslation()

  const openAddFolderModal = () => {
    appContext.showModal(ModalType.AddFavoritesFolder)
  }

  useEffect(()=>{
    foldersContext.getAllFolders()
  }, [])

  const titleButtons = (
    <div className={styles.buttonsWrapper}>
      <Button styleType={['grey', 'icon']} onClick={openAddFolderModal}><PlusSvg/> {t('favorites_add')}</Button>
      <Button styleType={['grey', 'icon']}><SettingSvg/> {t('favorites_settings')}</Button>
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