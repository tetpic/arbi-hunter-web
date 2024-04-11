import styles from './index.module.scss'

import Image from 'next/image'
import Formatter from 'utils/formatter'
import Link from 'next/link'
import SwiperList from '../SwiperList'
import useTranslation from 'next-translate/useTranslation'
import classNames from 'classnames'
import P from '../P'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'

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
    <SwiperList hideNav={props.hideNav} className={props.className} swiperProps={{freeMode: false}}>
      {props.categories && props.categories.map(category=> {
        return (
          <Link 
          href={(props.link||'/media/page?page=categories&category=')+category.id} 
          replace={true} 
          className={classNames(styles.categoryItem, props.itemClassName)}
          >
            <div className={styles.imageWrapper}>
              <Image 
              unoptimized
              src={ImageHelper.urlFromFile(category.image, Preset.xsResize)}
              alt={category.name+ ' image'} 
              width={100} 
              height={100}
              style={{objectFit:'cover', width: '100%', height: '100%'}}
              className={styles.image}
              />
            </div>


            <P useThemeColor styleType={['large', 'w600']} className={styles.name} title={category.name}>{category.name}</P>
            {props.articlesCounter && category.articlesCount &&
              <div  className={styles.artCounter} ><span>{category.articlesCount} {Formatter.pluralize(+category.articlesCount, t('articlesCounter1'), t('articlesCounter2'), t('articlesCounter3') )}</span></div>
            }
          </Link>
        )
      })}
    </SwiperList>   
  )
}