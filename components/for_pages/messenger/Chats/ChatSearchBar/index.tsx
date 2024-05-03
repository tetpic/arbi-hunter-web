import styles from './index.module.scss'

import LoupeSvg from 'components/svg/LoupeSvg'
import FiltersSvg from 'components/svg/FiltersSvg'
import Button from 'components/ui/Button'
import { useState } from 'react'
import classNames from 'classnames'
import FolderClosedSvg from 'components/svg/FolderClosedSvg'
import { ChatComponent, useChatContext } from 'context/chat_state'
import CrossSvg from 'components/svg/CrossSvg'
import { colors } from 'styles/variables'
import { useResize } from 'components/hooks/useResize'
import Title from 'components/ui/TitleForSection'
import { useAppContext } from 'context/state'
import { AppTheme, ModalType } from 'types/enums'
import { IChatFilterModalProps } from 'components/modals/ChatFilterModal'
import { IVacancy } from 'data/interfaces/IVacancy'
import useTranslation from 'next-translate/useTranslation'
import PlusSvg from '@/components/svg/PlusSvg'
import P from '@/components/ui/P'

interface Props {
}

export default function ChatSearchBar(props: Props) {
  const {t} = useTranslation()
  const [active, setActive] = useState<boolean>(false)
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light
  const {isTabletWidth} = useResize()
  const chatContext = useChatContext()


  const openFiltersModal = () => {
    const chatAllVacancies = [...chatContext.chatsRef.current.values()].map(el=> el.application?.vacancy&&el.application?.vacancy)
    const chatVacancies: Map<number, IVacancy> = new Map()
    chatAllVacancies.forEach(el=> chatVacancies.set(el?.id, el))
    if(isTabletWidth) {
      appContext.showBottomSheet<IChatFilterModalProps>(ModalType.ChatFilterModal, 
        {
          vacancies: [...chatVacancies.values()],
          onSubmit: (data) => chatContext.setFilter(data),
          onClear: () => chatContext.setFilter(null),
          filters: chatContext.filter
        }, 400)
    }
    else {
      appContext.showModal<IChatFilterModalProps>(ModalType.ChatFilterModal, 
        {
          vacancies: [...chatVacancies.values()],
          onSubmit: (data) => chatContext.setFilter(data),
          onClear: () => chatContext.setFilter(null),
          filters: chatContext.filter
        }
      )
    }
  }


  return (
  <div className={styles.root}> 
    <div className={styles.rootWrapper}>
      {isTabletWidth &&
        <Title className={styles.title} title={t('chat_main')}/>
      }
      <div className={classNames(styles.inputWrapper, (active||chatContext.component.get(ChatComponent.Folder))&&styles.inputWrapper_active)}>
        {chatContext.component.get(ChatComponent.Folder) &&
        <>
          <FolderClosedSvg color={isLightTheme&&colors.black}/>
          <P styleType={['medium', 'w500']} useThemeColor>{t('chat_folders')}</P>
          <CrossSvg color={colors.greyLight} className={styles.closeSvg} onClick={()=>{chatContext.setComponent([{component: ChatComponent.Folder, active: false}, {component: ChatComponent.Dialog, active: true}])}}/>
        </>
        ||
        <>
          <LoupeSvg className={styles.loupe}/>
          <input type="text" onFocus={()=>setActive(true)}  onBlur={()=>setActive(false)} placeholder={t('chat_searchPlaceholder')} />
        </>
        }
      </div>
      <Button className={styles.filterButton} onClick={openFiltersModal}><FiltersSvg/></Button>
      <Button styleType={['grey', 'icon']} altStyleType={['white', 'invertSvg', 'icon']} className={styles.button} onClick={()=>{chatContext.setComponent([{component: ChatComponent.Folder, active: true}])}}><PlusSvg/></Button>
    </div>
  </div>
  )
}