import styles from './index.module.scss'

import LoupeSvg from 'components/svg/LoupeSvg'
import FiltersSvg from 'components/svg/FiltersSvg'
import Button from 'components/ui/Button'
import { useState } from 'react'
import classNames from 'classnames'
import FolderClosedSvg from 'components/svg/FolderClosedSvg'
import { useChatContext } from 'context/chat_state'
import CrossSvg from 'components/svg/CrossSvg'
import { colors } from 'styles/variables'
import { useResize } from 'components/hooks/useResize'
import Title from 'components/ui/TitleForSection'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { IChatFilterModalProps } from 'components/modals/ChatFilterModal'

interface Props {
}

export default function ChatSearchBar(props: Props) {
  const [active, setActive] = useState<boolean>(false)
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()
  const chatContext = useChatContext()


  const openFiltersModal = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet<IChatFilterModalProps>(ModalType.ChatFilterModal, 
        {
          vacancies: chatContext.chatsRef.current.map(el=> el.application?.vacancy&&el.application?.vacancy),
          onSubmit: (data) => chatContext.setFilter(data),
          onClear: () => chatContext.setFilter(null)
        }, 400)
    }
    else {
      appContext.showModal<IChatFilterModalProps>(ModalType.ChatFilterModal, 
        {
          vacancies: chatContext.chatsRef.current.map(el=> el.application?.vacancy&&el.application?.vacancy),
          onSubmit: (data) => chatContext.setFilter(data),
          onClear: () => chatContext.setFilter(null)
        }
      )
    }
  }


  return (
  <div className={styles.root}> 
    <div className={styles.rootWrapper}>
      {isTabletWidth &&
        <Title className={styles.title} title={'Чаты'}/>
      }
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
      <Button className={styles.filterButton} onClick={openFiltersModal}><FiltersSvg/></Button>
      <Button className={styles.button} onClick={chatContext.setFoldersActive}><FolderClosedSvg/></Button>
    </div>
  </div>
  )
}