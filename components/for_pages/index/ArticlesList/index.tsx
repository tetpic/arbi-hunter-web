import SwiperList from '@/components/ui/SwiperList'
import styles from './index.module.scss'
import { IArticle } from 'data/interfaces/IArticle'
import Image from 'next/image'
import P from '@/components/ui/P'
import TextNode from '@/components/ui/TextNode'
import Formatter from 'utils/formatter'
import { useAppContext } from 'context/state'
import { AppTheme, Preset } from 'types/enums'
import classNames from 'classnames'
import ImageHelper from 'utils/ImageHelper'

interface Props {
  news: IArticle[]
  onlyTitles?: boolean
}



export default function ArticlesList(props: Props) {
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light

  return (
    <SwiperList
    hideNav
    slideClassName={styles.slide}
    swiperClassname={styles.swiper}
    swiperProps={{loop: false}}
    >
      {props.news && props.news.map(el=>{
        return (
          <div className={classNames(styles.news, isLightTheme && styles.news_light) }>
            <Image unoptimized src={ImageHelper.urlFromFile(el.image, Preset.smCrop)} alt={'news'} width={372} height={180} className={styles.image}/>
            <div className={styles.content}>
              <P styleType={['fs20', 'w600']} useThemeColor className={classNames(props.onlyTitles?styles.titleOnly:styles.title)}>{el.name}</P>
                {!props.onlyTitles &&
                <P styleType={['medium','greyLight']} className={styles.description}><TextNode html={el.blocks[0].body}/></P>
                }
                <div className={styles.bottom}>
                  <div className={styles.tag}>{el.articleCategory.translations.find(el => el.languageCode === 'ru').name.split(' ')[0]}</div>
                  <P styleType={['medium', 'w500']} useThemeColor>{Formatter.formatDistanceToNow(el.createdAt)} назад</P>
                </div>
            </div>
          </div>
        )
      })}
    </SwiperList>
  )
}