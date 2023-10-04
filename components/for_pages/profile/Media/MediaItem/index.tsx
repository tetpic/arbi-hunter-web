import HeartSvg from 'components/svg/HeartSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import { IArticle } from 'data/interfaces/IArticle'
import UserPic from 'components/ui/UserPic'
import Formatter from 'utils/formatter'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import { useEffect, useState } from 'react'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { CategoryType, Languages } from 'types/enums'
import styles from './index.module.scss'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import { FILES } from 'types/constants'


interface Props {
  media: IArticle
  showContent?: boolean
  type?: CategoryType
}

export default function MediaItem({media, showContent, type}: Props) {
  

  const [content, setContent] = useState<IArticle>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(()=>{
    if(showContent) {
      ArticlesRepository.getById(media.id, Languages.ru).then(res=>{
        setContent(res)
        setLoading(false)
      })
    }
  }, [])

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
    {showContent && content && !loading &&
    content.blocks.map(b=> {
      return (<>
      <p className={styles.contentTitle}>{b.title}</p>
      <div className={styles.content} dangerouslySetInnerHTML={{__html: b.body}}></div>
      </>)
    })
    ||
    (loading && showContent && <Spinner size={32} color={colors.yellow}/>)
    }
    <div className={styles.stats}>
      <p ><HeartSvg size={24}/> {media.likesCount||'0'}</p>
      <p ><OpenEyeSvg/> {media.totalViews||'0'}</p>
    </div>
    
  </div>)
}