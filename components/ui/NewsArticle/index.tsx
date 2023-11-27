import styles from './index.module.scss'

import { IArticle } from 'data/interfaces/IArticle'
import Image, { StaticImageData } from 'next/image'
import Formatter from 'utils/formatter'
import ThreeDotsButton from '../ThreeDotsButton'
import HeartSvg from 'components/svg/HeartSvg'
import classNames from 'classnames'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import { FILES } from 'types/constants'
import { useMediaContext } from 'context/media_state'
import UserPic from '../UserPic'
import { useEffect, useState } from 'react'

interface Props {
  article: IArticle
  titleImg?: string|StaticImageData
  titleName?: string
  withDefaultIcon?: boolean
}

/**
 * @article IArticle
 * @titleImg  string|StaticImageData
 * @titleName  string
 * @withDefaultIcon boolean
 */
export default function NewsArticle(props: Props) {
  const article = props.article
  const mediaContext = useMediaContext()
  const [isLiked, setIsLiked] = useState<boolean>(props.article.isLikedByCurrentProfile)
  const [likesCounter, setLikesCounter] = useState<number>(Number(props.article.likesCount))

  const likeHandler = (a: IArticle)=> {
    const article: IArticle = {...a, isLikedByCurrentProfile: isLiked} 
    mediaContext.likeArticle(article)
    .then(_=>setIsLiked(!isLiked))
  }

  useEffect(()=>{
    if(isLiked !== props.article.isLikedByCurrentProfile) {
      isLiked?setLikesCounter(s => s+1):setLikesCounter(s => s-1)
    }
    else {
      setLikesCounter(Number(props.article.likesCount))
    }
  }, [isLiked])

  return ( <div className={styles.item}>
    <div className={styles.top}>
      {(props.titleImg || props.withDefaultIcon) &&
        <UserPic className={styles.imageWrapper} image={props.titleImg&&FILES + props.titleImg} size={40}/>
      }
      <p className={styles.name}>{props.titleName}</p>
      <p className={styles.time}>{Formatter.formatDateRelative(article.createdAt)}</p>
      <ThreeDotsButton className={styles.dots}/>
    </div>
    <div className={styles.body}>
      <p className={styles.content}>{article.name}</p>
      {article.image?.source &&
        <Image src={FILES + article.image.source} alt={article.name} width={727} height={390} style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: 16
        }}/>
      }
    </div>
    <div className={styles.stats}>
      <p className={styles.likes} onClick={(e)=> {e.stopPropagation(); likeHandler(article)}}><HeartSvg className={classNames(isLiked&&styles.filledHeart)}/> {likesCounter}</p>
      <p className={styles.views}><OpenEyeSvg/> {article.totalViews}</p>
    </div>
  </div>)
}