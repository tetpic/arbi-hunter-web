import styles from './index.module.scss'

import { useResize } from 'components/hooks/useResize'
// import { CommunityNewsViewModalProps } from 'components/modals/CommunityNewsViewModal'
import NewsArticle from 'components/ui/NewsArticle'
import { useCommunityContext } from 'context/community_state'
// import { useMediaContext } from 'context/media_state'
import { useAppContext } from 'context/state'
import { IArticle } from 'data/interfaces/IArticle'
import dynamic from 'next/dynamic'
import { ModalType } from 'types/enums'

const CreateNewCommunityArticle = dynamic(import('./CreateNewCommunityArticle'), {ssr: false})
interface Props {
}

export default function CommunityContent(props: Props) {
  // const mediaContext = useMediaContext()
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()
  const communityContext = useCommunityContext()

  const isAdmin = communityContext.currentCommunity?.id === communityContext.myCommunity?.id

  // const likeHandler = async (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>, news: IArticle) => {
  //   e.stopPropagation()
  //   await mediaContext.likeArticle(news)
  //   communityContext.setCommunityNews(state=>{     
  //     const counter = news.isLikedByCurrentProfile?Number(news.likesCount) -1: Number(news.likesCount) +1
  //     state.set(news.id, {...news, isLikedByCurrentProfile: !news.isLikedByCurrentProfile, likesCount: String(counter) })
  //     return new Map(state)
  //   })
  // }

  const dotsHandler = (e: React.MouseEvent<Element, MouseEvent>, news: IArticle) => {
    e.stopPropagation()
    e.preventDefault()
    isTabletWidth 
    ?appContext.showBottomSheet(ModalType.MediaItemActionsModal, {isAdmin, news})
    :appContext.showModal(ModalType.MediaItemActionsModal, {isAdmin, news})
  }

  // const openNewsHandler = (news: IArticle) => {
  //   appContext.showModal<CommunityNewsViewModalProps>(ModalType.CommunityNewsViewModal, [news, communityContext.currentCommunity, isAdmin] )
  // }

  return (
  <div className={styles.root}> 
      <div className={styles.infinite}>
        {communityContext.myCommunity?.id === communityContext.currentCommunity.id && !isTabletWidth &&
          <CreateNewCommunityArticle/>
        }
        {communityContext.communityNews&&communityContext.communityNews.size > 0 && 
        [...communityContext.communityNews.values()].map(news=> {
          return (
            <NewsArticle threeDotsHandler={(e, article)=> dotsHandler(e, article)} titleName={communityContext.currentCommunity?.name} article={news} titleImg={communityContext.currentCommunity?.logo?.source}/>
          )
        })
        ||
        <p className={'empty'}>Нет новостей</p>
        }
      </div>
  </div>
  )
}