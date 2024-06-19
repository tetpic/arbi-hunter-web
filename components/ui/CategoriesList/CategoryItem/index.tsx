import styles from './index.module.scss'
import Image from 'next/image'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import ImageHelper from 'utils/ImageHelper'
import { AppTheme, Preset } from 'types/enums'
import P from '../../P'
import useTranslation from 'next-translate/useTranslation'
import { useAppContext } from 'context/state'



interface Props<T> {
  category: T
  onClick?: (category: T) => void
  itemClassName?: string
  articlesCounter?: boolean
  imageWrapperClassName?: string
}

export default function CategoryItem<T extends {[key: string]: any}>(props: Props<T>) {
  const {t} = useTranslation()
  const category = props.category
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light

  return (<div 
    onClick={()=>props.onClick(category)}
    className={classNames(styles.categoryItem, props.itemClassName, isLightTheme&&styles.categoryItem_light)}
    >
      <div className={classNames(styles.imageWrapper, props.imageWrapperClassName)}>
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
      <P useThemeColor styleType={['small', 'w600']} className={styles.name} title={category.name}>{category.name}</P>
      {props.articlesCounter && category.articlesCount &&
        <div  className={styles.artCounter} ><span>{category.articlesCount} {Formatter.pluralize(+category.articlesCount, t('articlesCounter1'), t('articlesCounter2'), t('articlesCounter3') )}</span></div>
      }
    </div>
  )
}