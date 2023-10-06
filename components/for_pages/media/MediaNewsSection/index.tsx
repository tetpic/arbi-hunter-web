import Button from 'components/ui/Button'
import { useRouter } from 'next/router'
import styles from './index.module.scss'
import { IArticle } from 'data/interfaces/IArticle'
import Image from 'next/image'
import { FILES } from 'types/constants'

interface Props {
  title: string
  link?: string
  news?: IArticle[]
}

export default function MediaNewsSection(props: Props) {
  const router = useRouter()
  const firstItem = props.news[0]

  return (<section className={styles.root}> 
  <p className={styles.title}>{props.title}</p>
  <div className={styles.content}>
    <div className={styles.mainItem}>
      {/* <div className={styles.tags}>
        <p className={classNames(styles.tag, styles.red)}>Разработка</p>
        <p className={classNames(styles.tag, styles.purple)}>Веб-дизайн</p>
      </div> */}
      <div className={styles.textWrapper}>
        <p className={styles.itemTitle}>{firstItem.name}</p>
        {firstItem.shortDescription &&
          <p className={styles.itemDesc}>{firstItem.shortDescription}</p>
        }
      </div>
      <div className={styles.imageWrapper}>
        {firstItem.image &&  
          <Image 
          priority 
          src={FILES + firstItem.image.source} 
          alt={firstItem.name} 
          style={{objectFit:'cover'}}
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
            {/* <div className={styles.tags}>
              <p className={classNames(styles.tag, styles.orange)}>Разработка</p>
              <p className={classNames(styles.tag, styles.green)}>Веб-дизайн</p>
            </div> */}
            <div className={styles.textWrapper}>
              <p className={styles.itemTitle}>{item.name}</p>
              {item.shortDescription &&
                <p className={styles.itemDesc}>{item.shortDescription}</p>
              }
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
    <Button className={styles.watchAll} onClick={()=>router.push(props.link)}>Смотреть все</Button>
  }


  </section>)
}