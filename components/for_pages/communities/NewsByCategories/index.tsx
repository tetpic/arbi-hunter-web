import { ICategory } from 'data/interfaces/Common'
import Image from 'next/image'
import message from 'images/message_front.png'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import { useEffect, useState } from 'react'
import { IArticle } from 'data/interfaces/IArticle'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import Formatter from 'utils/formatter'
import { FILES } from 'types/constants'
import HeartSvg from 'components/svg/HeartSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import InfiniteScroll from 'react-infinite-scroll-component'
import { colors } from 'styles/variables'
import Spinner from 'components/ui/Spinner'

import styles from './index.module.scss'
import classNames from 'classnames'
import { useMediaContext } from 'context/media_state'
import SortArrowsSvg from 'components/svg/SortArrowsSvg'
import { useUserContext } from 'context/user_state'

interface Props {
  category: ICategory
}

export default function NewsByCategories(props: Props) {
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>()
  const mediaContext = useMediaContext()
  const news= mediaContext.currentNews
  const userContext = useUserContext()

  const likeHandler = (a: IArticle)=> {
    mediaContext.likeArticle(a)
  }
  
  useEffect(()=>{
    setPage(1)
    setTotal(null)
    mediaContext.setCurrentNews({clear: true})
  }, [props.category])

  useEffect(()=>{
    ArticlesRepository.getNews(true, {categories: props.category.id, isTop: false, page: page, limit: 10}, userContext?.currentProfile.profileType)
    .then(res => {
      setTotal(res.total)
      mediaContext.setCurrentNews({articles: res.data})
    })
  }, [page, props.category])

  return (<>
  <div className={styles.sort}>
    <p className={styles.found}> Найдено {total||0} {Formatter.pluralize(total, 'статья', 'статьи', 'статей')}</p>
    <p className={styles.sortBy}>Сортировать по <SortArrowsSvg/></p>
  </div>
  <div className={styles.root}> 
  <InfiniteScroll 
  next={()=>setPage(p => p+1)} 
  hasMore={news.size < total} 
  loader={<Spinner size={24} color={colors.yellow}/>} 
  dataLength={news.size}
  height={'100%'}
  >
    {news.size > 0 && [...news.values()].map(el=> {
      return (<>
        <div className={styles.item}>
          <div className={styles.top}>
            <div className={styles.imageWrapper}>
              <Image src={message} alt={'message bubble'} width={24} height={24}/>
            </div>
            <p className={styles.name}>{props.category.name}</p>
            <p className={styles.time}>{Formatter.formatDateRelative(el.createdAt)}</p>
            <ThreeDotsButton className={styles.dots}/>
          </div>
          <div className={styles.body}>
            <p className={styles.content}>{el.name}</p>
            <Image src={FILES + el.image.source} alt={el.name} width={727} height={390} style={{
              width: '100%',
              objectFit: 'cover',
              borderRadius: 16
            }}/>
          </div>
          <div className={styles.stats}>
            <p className={styles.likes} onClick={(e)=> {e.stopPropagation(); likeHandler(el)}}><HeartSvg className={classNames(el.isLikedByCurrentProfile&&styles.filledHeart)}/> {el.likesCount}</p>
            <p className={styles.views}><OpenEyeSvg/> {el.totalViews}</p>
          </div>
        </div>
      </>)
    })}
    </InfiniteScroll>
  </div>
  </>)
}