import styles from './index.module.scss'

import HeartSvg from 'components/svg/HeartSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import { IArticle } from 'data/interfaces/IArticle'
import UserPic from 'components/ui/UserPic'
import Formatter from 'utils/formatter'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import { CategoryType } from 'types/enums'
import Spinner from 'components/ui/Spinner'
import { FILES } from 'types/constants'
import classNames from 'classnames'
import { useMediaContext } from 'context/media_state'


interface Props {
  media: IArticle
  showContent?: boolean
  type?: CategoryType
}


/**
 * @media IArticle
 * @showContent boolean
 * @type CategoryType
 */
export default function MediaItem({media, showContent, type}: Props) {

  const mediaContext = useMediaContext()

  const likeHandler = () => {
    mediaContext.likeArticle(media)
  }

  const isNews = type === CategoryType.News

  return (  <div className={styles.item}>
    <div className={styles.head}>
      {(!type || !isNews) &&
        <UserPic size={48} className={styles.userPic} image={media.image?.source&&FILES+media.image.source}/>
      }
      <p className={styles.name} title={media.name}>{media.community?.name||media.shortDescription||media.name}</p>
      <p className={styles.date}>{Formatter.formatDateRelative(media.createdAt)}</p>
      {!type || !isNews && <ThreeDotsButton className={styles.dots}/>}
    </div>
    {(!type || !isNews) && 
    <p className={styles.description}>
      {media.name}
    </p>
    }
    <div className={styles.images}>
    </div>
      {showContent && media.blocks &&
      media.blocks.map(b=> {
        return (<>
        <p className={styles.contentTitle}>{b.title}</p>
        <div className={styles.content} dangerouslySetInnerHTML={{__html: b.body}}></div>
        </>)
      })
      ||
      (showContent && <Spinner size={32} />)
    }
    <div className={styles.stats}>
      <p className={styles.like} onClick={likeHandler}><HeartSvg className={classNames(media.isLikedByCurrentProfile&&styles.heartFilled)} size={24}/> {media.likesCount||'0'}</p>
      <p ><OpenEyeSvg/> {media.totalViews||'0'}</p>
    </div>
    
  </div>)
}