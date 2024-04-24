import { IFolder } from 'data/interfaces/IFolder'
import styles from './index.module.scss'
import Button from '@/components/ui/Button'
import ArrowDownSvg from '@/components/svg/ArrowDownSvg'
import P from '@/components/ui/P'
import { useFavoritesFolderContext } from 'context/favorites_folder_state'
import CvItem from '@/components/ui/CvItem'
import SortArrowsSvg from '@/components/svg/SortArrowsSvg'
import { useState } from 'react'
import classnames from 'classnames'
import Accordeon from '@/components/ui/Accordeon'
import Spacer from '@/components/ui/Spacer'
import ThreeDotsButton from '@/components/ui/ThreeDotsButton'

interface Props {
  folder: IFolder
  initialActive?: boolean
}

export default function FavoritesHirerFolder(props: Props) {
  const foldersContext = useFavoritesFolderContext()
  const [isActive, setIsActive] = useState<boolean>(props.initialActive||false) 


  return (<div className={styles.root}> 
    <div className={styles.top}  onClick={() => setIsActive(!isActive)}>
      <Button styleType={['backTransparent', 'icon']}><ArrowDownSvg className={classnames(styles.arrow, isActive&&styles.arrow_active)}/></Button>
      <div className={styles.folderDesc}>
        <P styleType={['w600', 'large']}>{props.folder.name}</P>
      </div>
      <ThreeDotsButton className={styles.threeDots}/>
    </div>
    <Spacer basis={16}/>
    <Accordeon isActive={isActive}>
      <div className={styles.stats}>
        <P>{foldersContext.currentFolderPage.get(props.folder.id)?.total} резюме</P>
        <Button styleType={['icon', 'backTransparent']}><SortArrowsSvg/> По дате</Button>
      </div>
      <div className={styles.cvsWrapper}>
        {foldersContext.cvsByFolderId.get(props.folder.id)?.map(el => {
          return el.cvs.map(cv => {
            return <CvItem cv={cv}/>
          })
        })}
      </div>
    </Accordeon>
  </div>)
}