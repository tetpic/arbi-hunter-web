import styles from './index.module.scss'

import Image from 'next/image'
import Formatter from 'utils/formatter'
import SwiperList from '../SwiperList'
import useTranslation from 'next-translate/useTranslation'
import classNames from 'classnames'
import P from '../P'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'
import { useRouter } from 'next/router'

interface Props<T> {
  categories: T[]
  hideNav?: boolean
  className?: string
  title?: string
  articlesCounter?:boolean
  link?: string
  itemClassName?: string
  onClick?: (category: T) => void
}


export default function CategoriesList<T extends {[key: string]: any}>(props: Props<T>) {
  const {t} = useTranslation()
  const router = useRouter()

  const onRedirect = (category: T) => {
    if(props.onClick) {
      props.onClick(category)
    }
    else {
      router.push((props.link||'/media/page?page=categories&categories=')+category.id)
    }
  }

  return (
    <SwiperList hideNav={props.hideNav} className={props.className} swiperProps={{freeMode: false}}>
      {props.categories && props.categories.map(category=> {
        return (
          <div 
          onClick={()=>onRedirect(category)}
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
          </div>
        )
      })}
    </SwiperList>   
  )
}