import LoupeSvg from 'components/svg/LoupeSvg'
import FiltersSvg from 'components/svg/FiltersSvg'
import Button from 'components/ui/Button'
import { useState } from 'react'
import classNames from 'classnames'
import FolderClosedSvg from 'components/svg/FolderClosedSvg'
import { useChatContext } from 'context/chat_state'
import CrossSvg from 'components/svg/CrossSvg'
import { colors } from 'styles/variables'
import styles from './index.module.scss'

interface Props {
}

export default function ChatSearchBar(props: Props) {
  const [active, setActive] = useState<boolean>(false)
  const chatContext = useChatContext()

  return (
  <div className={styles.root}> 
    <div className={styles.rootWrapper}>
      <div className={classNames(styles.inputWrapper, (active||chatContext.foldersActive)&&styles.inputWrapper_active)}>
        {chatContext.foldersActive &&
        <>
          <FolderClosedSvg/>
          <p className={styles.folderText}>Папки с чатами</p>
          <CrossSvg color={colors.greyLight} className={styles.closeSvg} onClick={chatContext.setFoldersActive}/>
        </>
        ||
        <>
          <LoupeSvg className={styles.loupe}/>
          <input type="text" onFocus={()=>setActive(true)}  onBlur={()=>setActive(false)} placeholder='Поиск по чатам' />
        </>
        }
      </div>
      <Button className={styles.filterButton}><FiltersSvg/></Button>
      <Button className={styles.button} onClick={chatContext.setFoldersActive}><FolderClosedSvg/></Button>
    </div>
  </div>
  )
}