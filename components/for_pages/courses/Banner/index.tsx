import styles from './index.module.scss'

import Button from 'components/ui/Button'
import Image from 'next/image'
import { ICategory } from 'data/interfaces/Common'
import Formatter from 'utils/formatter'
import { FILES } from 'types/constants'
import classNames from 'classnames'

interface Props {
  category: ICategory
  className?: string
  colorGradient?: string[]
}

export default function Banner(props: Props) {

  return (
  <div className={classNames(styles.root, props.className)} style={{background: `linear-gradient( 241deg, ${props.colorGradient[0]} 30%, ${props.colorGradient[1]} 100%)`}}> 
    <div className={styles.content}>
      <p className={styles.title}>{props.category.name}</p>
      <p className={styles.subTitle}>{props.category.description}</p>
      <Button className={styles.button}> <span style={{color: `#${props.category.color}`}}>Выбрать из {props.category.coursesCount} {Formatter.pluralize(+props.category.coursesCount,'курса', 'курса', 'курсов')}</span></Button>
    </div>
    <div className={styles.imageWrapper}>
      {props.category.image &&
      <Image 
      src={FILES + props.category.image.source} 
      alt={'girl'} 
      width={440} 
      height={336} 
      style={{width:'100%', height:'100%', objectFit: 'contain'}}
      />
    }
    </div>
  </div>)
}