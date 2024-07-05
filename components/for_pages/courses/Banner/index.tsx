import styles from './index.module.scss'

import Button from 'components/ui/Button'
import Image from 'next/image'
import { ICategory } from 'data/interfaces/Common'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  category: ICategory
  className?: string
  colorGradient?: string[]
}

export default function Banner(props: Props) {
  const {t} = useTranslation()

  return (
  <div className={classNames(styles.root, props.className)} style={{background: `linear-gradient( 241deg, ${props.colorGradient[0]} 30%, ${props.colorGradient[1]} 100%)`}}> 
    <div className={styles.content}>
      <p className={styles.title}>{props.category?.name}</p>
      <p className={styles.subTitle}>{props.category.description}</p>
      <Button className={styles.button}> <span style={{color: `#${props.category?.color}`}}>{t('courses_chooseFrom')} {props.category?.coursesCount} {Formatter.pluralize(+props.category.coursesCount, t('course2'), t('course3'), t('course3'))}</span></Button>
    </div>
    <div className={styles.imageWrapper}>
      {props.category?.image &&
      <Image 
      unoptimized
      src={ImageHelper.urlFromFile(props.category?.image, Preset.smResize)} 
      alt={'banner image'} 
      width={440} 
      height={336} 
      style={{width:'100%', height:'100%', objectFit: 'contain'}}
      />
    }
    </div>
  </div>)
}