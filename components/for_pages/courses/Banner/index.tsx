import Button from 'components/ui/Button'
// import girl from 'images/girl.png'
import Image from 'next/image'
import styles from './index.module.scss'
import { ICategory } from 'data/interfaces/Common'
import Formatter from 'utils/formatter'
import { FILES } from 'types/constants'

interface Props {
  category: ICategory
}

export default function Banner(props: Props) {


  return (
  <div className={styles.root}> 
    <div className={styles.content}>
      <p className={styles.title}>{props.category.name}</p>
      <p className={styles.subTitle}>{props.category.description}</p>
      {/* <div className={styles.tags}>
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
      />
    }
    </div>
  </div>)
}