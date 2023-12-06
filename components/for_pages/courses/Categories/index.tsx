import styles from './index.module.scss'

import { ICategory } from 'data/interfaces/Common'
import Image from 'next/image'
import classNames from 'classnames'
import Formatter from 'utils/formatter'
import { useResize } from 'components/hooks/useResize'
import { Swiper, SwiperSlide } from 'swiper/react'
import Link from 'next/link'
import { FILES } from 'types/constants'

interface Props {
  categoryList: ICategory[]
}


function CategoryItem(props: {size: 33|50, item: ICategory}) {

  return (<Link href={`/courses/compilations?page=categories&category=${props.item.id}`}  className={classNames(styles.item, props.size === 50 && styles.item_large)} style={{ width: `calc(${props.size}% - 8px)` }} >
    <p className={styles.name}>{props.item.name}</p>
    <p className={styles.counter}>
      {(props.item?.coursesCount||props.item.articlesCount) + ' '} 
      {Formatter.pluralize(+props.item?.coursesCount||+props.item.articlesCount,'курс', 'курса','курсов')}
      </p>
    <div className={styles.imageWrapper}>
      {props.item.image &&
        <Image 
        priority
        src={FILES + props.item.image.source}
        alt={props.item.name + ' image'} 
        width={props.size===50?222:147}
        height={props.size===50?222:147}
        style={{objectFit:'cover', display: 'block'}}
        />
      }
    </div>
  </Link>)
}

export default function Categories(props: Props) {
  const {isTabletWidth} = useResize()

  return (
    <div className={styles.root}>
      <div className={styles.content}>
      {props.categoryList.length > 0 
      && !isTabletWidth &&
        props.categoryList.map((item, index)=> {
          return <CategoryItem key={item.id} size={index>1?33:50} item={item}/>
        })
      }
      {isTabletWidth &&
        <Swiper 
        spaceBetween={16}
        >
          {  
            props.categoryList.map((item, index)=> {
              return (
                <SwiperSlide>
                  <CategoryItem key={item.id} size={33} item={item}/>
                </SwiperSlide>
              ) 
            })
          }
        </Swiper>
      }
    </div>
      
    </div>
  )
}