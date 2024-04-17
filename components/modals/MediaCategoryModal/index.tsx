import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import { IMediaContextState, MediaWrapper, useMediaContext } from 'context/media_state'
import NewsByCategories from 'components/for_pages/media/MediaPage/NewsList'
import { ICategory } from 'data/interfaces/Common'
import { useAppContext } from 'context/state'
import Title from 'components/ui/TitleForSection'
import BackBtn from 'components/ui/BackBtn'
import SearchBar, { ISearchBarReturnParams } from 'components/ui/SearchBar'

interface Props {
  onClose: () => void
}

export interface IMediaCategoryModal {
  context?: Partial<IMediaContextState>,
  currentCategory: ICategory
  title: string
}

function MediaCategoryModalInner(props: Props) {
  const appContext = useAppContext()
  const mediaContext = useMediaContext()
  const args = appContext.modalArguments as IMediaCategoryModal

  const onCloseHandler = () => {
    props.onClose()
    // mediaContext.setCurrentNews({clear: true})
  }

  const search = (data: ISearchBarReturnParams) => {
    mediaContext.setSearchParams(state=> ({...state, activeCategories: [args.currentCategory.id], search: data.search}))
  }

  const body = (<div className={styles.root}>
    <BackBtn className={styles.backBtn} onClick={onCloseHandler} bgColor={'transparent'}/>
    <Title className={styles.title} title={args.title} />
    <SearchBar onSubmit={search}/>
    <NewsByCategories category={args.currentCategory} scrollableTarget='modalBody'/>
  </div>)

  return (
    <ModalLayout mobileFullScreen>
      <ModalBody className={styles.body} id='modalBody'>
          {body}
      </ModalBody>
    </ModalLayout>
  )
}

export default function MediaCategoryModal(props: Props){
  return (
    <MediaWrapper>
      <MediaCategoryModalInner {...props}/>
    </MediaWrapper>
  )
}