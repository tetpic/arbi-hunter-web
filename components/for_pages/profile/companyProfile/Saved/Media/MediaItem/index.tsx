import HeartSvg from 'components/svg/HeartSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import { IArticle } from 'data/interfaces/IArticle'
import styles from './index.module.scss'
import ThreeDotsSvg from 'components/svg/ThreeDotsSvg'
import UserPic from 'components/ui/UserPic'
import Formatter from 'utils/formatter'


interface Props {
  media: IArticle
}

export default function MediaItem({media}: Props) {

  const filePath = process.env.files

  return (  <div className={styles.item}>
    <div className={styles.head}>
      <UserPic size={48} className={styles.userPic} image={filePath+media.image.source}/>
      <p className={styles.name}>{media.community||media.shortDescription}</p>
      <p className={styles.date}>{Formatter.formatDateRelative(media.createdAt)}</p>
      <ThreeDotsSvg className={styles.dots}/>
    </div>
    <p className={styles.description}>
      {media.name}
    </p>
    <div className={styles.images}>
    </div>
    <div className={styles.stats}>
      <p ><HeartSvg size={24}/> {media.likesCount||'0'}</p>
      <p ><OpenEyeSvg/> {media.totalViews||'0'}</p>
    </div>
  </div>)
}