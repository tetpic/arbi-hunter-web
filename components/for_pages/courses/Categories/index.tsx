import styles from './index.module.scss'

import { ICategory } from 'data/interfaces/Common'
import Image from 'next/image'
import classNames from 'classnames'
import Formatter from 'utils/formatter'
import { useResize } from 'components/hooks/useResize'
import { Swiper, SwiperSlide } from 'swiper/react'
import Link from 'next/link'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'

interface Props {
  categoryList: ICategory[]
  className?: string
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
        unoptimized
        src={ImageHelper.urlFromFile(props.item.image, Preset.xsResize)}
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
    <div className={classNames(styles.root, props.className)}>
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
        slidesPerView={'auto'}
        className={styles.swiper}
        >
          {  
            props.categoryList.map((item, index)=> {
              return (
                <SwiperSlide className={styles.slide}>
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