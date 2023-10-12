// import { useRouter } from 'next/router'
import styles from './index.module.scss'
import { IArticle } from 'data/interfaces/IArticle'
import Image from 'next/image'
import { FILES } from 'types/constants'
import { Languages } from 'types/enums'
import LinkBlack from 'components/ui/LinkBlack'

interface Props {
  title: string
  link?: string
  news?: IArticle[]
}

export default function MediaNewsSection(props: Props) {
  

  const firstItem = props.news[0]

  return (<section className={styles.root}> 
  <p className={styles.title}>{props.title}</p>
  <div className={styles.content}>
    <div className={styles.mainItem}>
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
        {/* {firstItem.shortDescription && */}
          <p className={styles.itemDesc} dangerouslySetInnerHTML={{__html: firstItem.blocks[0].body}}></p>
        {/* } */}
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
    </div>
    <div className={styles.otherItems}>
      {props.news && props.news.slice(1, 4).map(item => {
        return (
          <div className={styles.item} key={item.id}>
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
              {/* {item.shortDescription && */}
                <p className={styles.itemDesc} dangerouslySetInnerHTML={{__html: item.blocks[0].body}}></p>
              {/* } */}
            </div>
            <div className={styles.imageWrapper}>
              {item.image && 
                <Image 
                src={FILES + item.image.source} 
                alt={item.name} 
                width={115} 
                height={137} 
                style={{objectFit:'cover'}}
                />
              }
            </div>
          </div>
        )
      })}
    </div>
  </div>

  {props.link &&
    <LinkBlack href={props.link}>Смотреть все</LinkBlack>
  }


  </section>)
}