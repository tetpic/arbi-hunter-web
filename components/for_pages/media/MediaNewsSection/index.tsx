import styles from './index.module.scss'

// import { useRouter } from 'next/router'
import { IArticle } from 'data/interfaces/IArticle'
import Image from 'next/image'
import { FILES } from 'types/constants'
import { Languages } from 'types/enums'
import LinkBlack from 'components/ui/LinkBlack'
import TextNode from 'components/ui/TextNode'
import { useResize } from 'components/hooks/useResize'
import Link from 'next/link'

interface Props {
  link?: string
  news?: IArticle[]
}

export default function MediaNewsSection(props: Props) {
  const firstItem = props.news[0]
  const {isTabletWidth} = useResize()

  return (<section className={styles.root}> 
  <div className={styles.content}>
    {!isTabletWidth &&
      <Link href={`/media/article/${firstItem.id}`} className={styles.mainItem}>
        <div className={styles.tags}>
          <p 
          className={styles.tag}
          style={{backgroundColor: `#${firstItem.articleCategory.color}`}}
          >
            {firstItem.articleCategory.translations.find(e=>e.languageCode === Languages.ru).name}
          </p>
        </div>
        <div className={styles.textWrapper}>
          <p className={styles.itemTitle}>{firstItem.name}</p>
            <p className={styles.itemDesc}>
              <TextNode html={firstItem.blocks[0].body}/>
            </p> 
        </div>
        <div className={styles.imageWrapper}>
          {firstItem.image &&  
            <Image 
            priority 
            src={FILES + firstItem.image.source} 
            alt={firstItem.name} 
            style={{objectFit:'cover', width: '100%'}}
            width={664}
            height={345}
            />
          }
        </div>
      </Link>
    }
    <div className={styles.otherItems}>
      {props.news && props.news.slice(1, 4).map(item => {
        return (
          <Link href={`/media/article/${item.id}`} className={styles.item} key={item.id}>
            <div className={styles.tags}>
              <p 
              className={styles.tag} 
              style={{backgroundColor: `#${item.articleCategory.color}`}}
              >
                {item.articleCategory.translations.find(e=>e.languageCode === Languages.ru).name}
              </p>
            </div>
            <div className={styles.textWrapper}>
              <p className={styles.itemTitle}>{item.name}</p>
                <p className={styles.itemDesc} >
                  <TextNode html={item.blocks[0].body}/>
                </p>
            </div>
            <div className={styles.imageWrapper}>
              {item.image && 
                <Image 
                src={FILES + item.image.source} 
                alt={item.name} 
                width={230} 
                height={260} 
                style={{objectFit:'cover', width: '100%', height: '100%'}}
                />
              }
            </div>
          </Link>
        )
      })}
    </div>
  </div>
  {props.link && !isTabletWidth &&
    <LinkBlack href={props.link}>Смотреть все</LinkBlack>
  }
  </section>)
}