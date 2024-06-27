import { IFolder } from 'data/interfaces/IFolder'
import styles from './index.module.scss'
import Button from '@/components/ui/Button'
import ArrowDownSvg from '@/components/svg/ArrowDownSvg'
import P from '@/components/ui/P'
import { useFavoritesFolderContext } from 'context/favorites_folder_state'
import CvItem from '@/components/ui/CvItem'
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
import { AppTheme, ModalType } from 'types/enums'
import { IConfirmModalProps } from '@/components/modals/ConfirmModal'
import useTranslation from 'next-translate/useTranslation'
import { colors } from 'styles/variables'
import InfiniteScroll from 'react-infinite-scroll-component'

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
  const isLightTheme = appContext.theme === AppTheme.Light
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

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
    const _args: IConfirmModalProps = {
      text: t('favorites_confirmDeletion'),
      callback: () => foldersContext.deleteFolder(props.folder.id),
      maxWidth: 400
    }
    isTabletWidth
      ? appContext.showBottomSheet<IConfirmModalProps>(ModalType.ConfirmModal, _args, 180)
      : appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, _args)
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
      <Button styleType={['backTransparent', 'icon']}><ArrowDownSvg className={classnames(styles.arrow, isActive&&styles.arrow_active)} color={isLightTheme&&colors.black}/></Button>
      <div className={styles.folderDesc}>
        <P styleType={['w600', 'large']} useThemeColor>{props.folder.name}</P>
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
    <Spacer basis={8}/>
    <Accordeon isActive={isActive}>
      <div className={styles.stats}>
        <P useThemeColor>{foldersContext.currentFolderPage.get(props.folder.id)?.total} {t('cv1')}</P>
      </div>
        <InfiniteScroll 
        next={function () {
          throw new Error('Function not implemented.')
        } } 
        hasMore={false} 
        loader={''} 
        scrollableTarget={'#foldersWrapper'}
        dataLength={0}>
          <div className={styles.cvsWrapper}>
            {foldersContext.cvsByFolderId.get(props.folder.id)?.map(el => {
              return el.cvs.map(cv => {
                return <CvItem cv={cv} onChangeItem={() => foldersContext.removeCvFromFolder(props.folder.id, cv.id)} key={cv.id}/>
              })
            })}
          </div>
        </InfiniteScroll>
    </Accordeon>
  </div>)
}