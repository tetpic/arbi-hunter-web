import styles from './index.module.scss'

import { ICategory } from 'data/interfaces/Common'
import Image from 'next/image'
// import { FILES } from 'types/constants'
import classNames from 'classnames'
import Formatter from 'utils/formatter'
import bitcoin from 'images/big_bitcoin.png'
import { useResize } from 'components/hooks/useResize'
import { Swiper, SwiperSlide } from 'swiper/react'

interface Props {
  categoryList: ICategory[]
}


function CategoryItem(props: {size: 33|50, item: ICategory}) {

  return (<div className={classNames(styles.item, props.size===50&&styles.item_large)} style={{width: `calc(${props.size}% - 8px)`}}>
    <p className={styles.name}>{props.item.name}</p>
    <p className={styles.counter}>
      {(props.item?.coursesCount||props.item.articlesCount) + ' '} 
      {Formatter.pluralize(+props.item?.coursesCount||+props.item.articlesCount,'курс', 'курса','курсов')}
      </p>
    <div className={styles.imageWrapper}>
      {props.item.image &&
        <Image 
        priority
        src={bitcoin}
        alt={props.item.name + ' image'} 
        width={props.size===50?222:147}
        height={props.size===50?222:147}
        style={{objectFit:'cover', display: 'block'}}
        />
      }
    </div>

  </div>)
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