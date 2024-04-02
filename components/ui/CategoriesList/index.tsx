import styles from './index.module.scss'

import Image from 'next/image'
import Formatter from 'utils/formatter'
import Link from 'next/link'
import { FILES } from 'types/constants'
import SwiperList from '../SwiperList'
import useTranslation from 'next-translate/useTranslation'
import classNames from 'classnames'

interface Props<T> {
  categories: T[]
  hideNav?: boolean
  className?: string
  title?: string
  articlesCounter?:boolean
  link?: string
  itemClassName?: string
}


export default function CategoriesList<T extends {[key: string]: any}>(props: Props<T>) {
  const {t} = useTranslation()

  return (
    <SwiperList hideNav={props.hideNav} className={props.className}>
      {props.categories && props.categories.map(category=> {
        return (
          <Link 
          href={(props.link||'/media/page?page=categories&category=')+category.id} 
          replace={true} 
          className={classNames(styles.categoryItem, props.itemClassName)}
          >
            <div className={styles.imageWrapper}>
              <Image 
              src={FILES + category.image.source}
              alt={category.name+ ' image'} 
              width={100} 
              height={100}
              style={{objectFit:'cover', width: '100%', height: '100%'}}
              className={styles.image}
              />
            </div>
            <p className={styles.name} title={category.name}>{category.name}</p>
            {props.articlesCounter && category.articlesCount &&
              <div  className={styles.artCounter} ><span>{category.articlesCount} {Formatter.pluralize(+category.articlesCount, t('articlesCounter1'), t('articlesCounter2'), t('articlesCounter3') )}</span></div>
            }
          </Link>
        )
      })}
    </SwiperList>   
  )
}