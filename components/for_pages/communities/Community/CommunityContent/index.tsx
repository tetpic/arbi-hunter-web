import classNames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import HeartSvg from 'components/svg/HeartSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import Spinner from 'components/ui/Spinner'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import UserPic from 'components/ui/UserPic'
import { useCommunityContext } from 'context/community_state'
import { useMediaContext } from 'context/media_state'
import { useAppContext } from 'context/state'
import { IArticle } from 'data/interfaces/IArticle'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { colors } from 'styles/variables'
import { FILES } from 'types/constants'
import { ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

const CreateNewCommunityArticle = dynamic(import('./CreateNewCommunityArticle'), {ssr: false})
interface Props {
}

export default function CommunityContent(props: Props) {
  const mediaContext = useMediaContext()
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()
  const communityContext = useCommunityContext()
  const [loading, setLoading] = useState()
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>()
  const contentLength = useRef(communityContext.communityNews.size)

  const isAdmin = communityContext.currentCommunity?.id === communityContext.myCommunity?.id
  
  useEffect(()=>{
    communityContext.getCommunityNews(page)
    .then(res => {
      if(res instanceof Object) {
       setTotal(res.total)        
      }
    })
  }, [page])

  useEffect(()=>{
    if(communityContext.communityNews) {
      contentLength.current = communityContext.communityNews.size
    }
  }, [communityContext.communityNews])

  const likeHandler = async (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>, news: IArticle) => {
    e.stopPropagation()
    await mediaContext.likeArticle(news)
    communityContext.setCommunityNews(state=>{     
      const counter = news.isLikedByCurrentProfile?Number(news.likesCount) -1: Number(news.likesCount) +1
      state.set(news.id, {...news, isLikedByCurrentProfile: !news.isLikedByCurrentProfile, likesCount: String(counter) })
      return new Map(state)
    })
  }

  const dotsHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, news: IArticle) => {
    e.stopPropagation()
    isTabletWidth 
    ?appContext.showBottomSheet(ModalType.MediaItemActionsModal, {isAdmin, news})
    :appContext.showModal(ModalType.MediaItemActionsModal, {isAdmin, news})
  }

  const openNewsHandler = (news: IArticle) => {
    appContext.showModal(ModalType.CommunityNewsViewModal, [news, communityContext.currentCommunity, isAdmin] )
  }


  return (
  <div className={styles.root}> 
    <InfiniteScroll 
    next={()=>setPage((p)=> p+1)} 
    hasMore={communityContext.communityNews.size < total} 
    loader={<Spinner size={24} color={colors.yellow}/>} 
    dataLength={contentLength.current}
    height={'100%'}
    >
      <div className={styles.infinite}>
        {communityContext.myCommunity?.id === communityContext.currentCommunity.id && !isTabletWidth &&
          <CreateNewCommunityArticle/>
        }
        {communityContext.communityNews&&contentLength.current > 0 && !loading &&
        [...communityContext.communityNews.values()].map(news=> {
          return (
              <div className={styles.item} key={news.id} onClick={()=>openNewsHandler(news)}>
                <div className={styles.top}>
                  <UserPic className={styles.userPic} image={communityContext.currentCommunity.logo&&FILES + communityContext.currentCommunity.logo.source} size={48}/>
                  <p className={styles.communityName}>{communityContext.currentCommunity.name}</p>
                  <p className={styles.published}>{Formatter.formatDateRelative(news.updatedAt)}</p>
                  <div onClick={(e)=>dotsHandler(e, news)}>
                    <ThreeDotsButton  className={styles.button}/>
                  </div>
                </div>
                <p className={styles.name}>{news.name}</p>
                {news.image &&
                <div className={styles.imageWrapper}>
                  <Image className={styles.image} src={FILES + news.image.source} alt={news.name + ' image'} width={727} height={277}/>
                </div>
                }
                <div className={styles.bottom}>
                  <p className={styles.likes} onClick={(e)=>likeHandler(e, news)}><HeartSvg className={classNames(news.isLikedByCurrentProfile&&styles.heartFilled)}/> {news.likesCount}</p>
                  <p className={styles.views}><OpenEyeSvg/> {news.totalViews}</p>
                </div>
            </div>
          )
        })
        ||
        loading && <Spinner size={24} color={colors.yellow}/>
        ||
        <p className={'empty'}>Нет новостей</p>
        }
      </div>
    </InfiniteScroll>
  </div>
  )
}