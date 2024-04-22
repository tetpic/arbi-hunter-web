import styles from './index.module.scss'
import Image from 'next/image'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'
import P from '../../P'
import useTranslation from 'next-translate/useTranslation'



interface Props<T> {
  category: T
  onClick?: (category: T) => void
  itemClassName?: string
  articlesCounter?: boolean
}

export default function CategoryItem<T extends {[key: string]: any}>(props: Props<T>) {
  const {t} = useTranslation()
  const category = props.category

  return (<div 
    onClick={()=>props.onClick(category)}
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
}