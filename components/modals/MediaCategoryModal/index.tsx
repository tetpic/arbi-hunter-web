import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import { IMediaContextState, MediaWrapper } from 'context/media_state'
import NewsByCategories from 'components/for_pages/media/MediaPage/NewsByCategories'
import { ICategory } from 'data/interfaces/Common'
import { useAppContext } from 'context/state'
import Title from 'components/ui/TitleForSection'
import BackBtn from 'components/ui/BackBtn'
import SearchBar from 'components/ui/SearchBar'

interface Props {
  onClose: () => void
}

export interface IMediaCategoryModal {
  context?: Partial<IMediaContextState>,
  currentCategory: ICategory
  title: string
}

export default function MediaCategoryModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as IMediaCategoryModal

  const onCloseHandler = () => {
    props.onClose()
  }

  const body = (<div className={styles.root}>
    <BackBtn className={styles.backBtn} onClick={onCloseHandler} bgColor={'transparent'}/>
    <Title title={args.title} />
    <SearchBar/>
    <NewsByCategories category={args.currentCategory}/>
  </div>)

  return (
    <ModalLayout mobileFullScreen>
      <ModalBody>
        <MediaWrapper>
          {body}
        </MediaWrapper>
      </ModalBody>
    </ModalLayout>
  )
}