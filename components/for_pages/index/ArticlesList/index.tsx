import SwiperList from '@/components/ui/SwiperList'
import styles from './index.module.scss'
import { IArticle } from 'data/interfaces/IArticle'
import Image from 'next/image'
import { FILES } from 'types/constants'
import P from '@/components/ui/P'
import TextNode from '@/components/ui/TextNode'
import Formatter from 'utils/formatter'

interface Props {
  news: IArticle[]
}



export default function ArticlesList(props: Props) {

  return (
    <SwiperList
    hideNav
    slideClassName={styles.slide}
    swiperClassname={styles.swiper}
    swiperProps={{loop: false}}
    >
      {props.news && props.news.map(el=>{
        return (
          <div className={styles.news}>
            <Image src={FILES + el.image.source} alt={'news'} width={372} height={180} className={styles.image}/>
            <div className={styles.content}>
              <P styleType={['large', 'w600']} className={styles.title}>{el.name}</P>
              <P styleType={['medium','greyLight']} className={styles.description}><TextNode html={el.blocks[0].body}/></P>
              <div className={styles.bottom}>
                <div className={styles.tag}>{el.articleCategory.translations.find(el => el.languageCode === 'ru').name.split(' ')[0]}</div>
                <P styleType={['medium', 'w500']}>{Formatter.formatDistanceToNow(el.createdAt)} назад</P>
              </div>
            </div>
          </div>
        )
      })}
    </SwiperList>
  )
}