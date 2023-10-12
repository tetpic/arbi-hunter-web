import Button from 'components/ui/Button'
import Image from 'next/image'
import { ICategory } from 'data/interfaces/Common'
import Formatter from 'utils/formatter'
import { FILES } from 'types/constants'
import classNames from 'classnames'
import styles from './index.module.scss'

interface Props {
  category: ICategory
  className?: string
}

export default function Banner(props: Props) {

  return (
  <div className={classNames(styles.root, props.className)}> 
    <div className={styles.content}>
      <p className={styles.title}>{props.category.name}</p>
      <p className={styles.subTitle}>{props.category.description}</p>
      {/* <div className={styles.tags}>
        {}
        <p className={styles.tag}>Разработка</p>
        <p className={styles.tag}>Дизайн</p>
        <p className={styles.tag}>Разработка</p>
        <p className={styles.tag}>Дизайн</p>
        <p className={styles.tag}>Разработка</p>
      </div> */}
      <Button className={styles.button}>Выбрать из {props.category.coursesCount} {Formatter.pluralize(+props.category.coursesCount,'курса', 'курса', 'курсов')}</Button>
    </div>
    <div className={styles.imageWrapper}>
      {props.category.image &&
      <Image 
      src={FILES + props.category.image.source} 
      alt={'girl'} 
      width={336} 
      height={336} 
      style={{width:'100%', height:'100%', objectFit: 'cover'}}
      />
    }
    </div>
  </div>)
}