import { ICategory } from 'data/interfaces/Common'
import Image from 'next/image'
import { FILES } from 'types/constants'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import {Autoplay} from 'swiper/modules'
import Button from 'components/ui/Button'
import Formatter from 'utils/formatter'
import { useRef } from 'react'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import styles from './index.module.scss'

interface Props {
    categories: ICategory[]
}

export default function MediaCategories(props: Props) {
  const swiper= useRef<SwiperRef>(null!)

  return (
  <section className={styles.root}> 
  <p className={styles.title}>Категории и рубрики</p>
  <Swiper
  ref={swiper}
  freeMode={true}
  slidesPerView={'auto'}
  autoplay={true}
  loop={true}
  modules={[Autoplay]}
  className={styles.swiper}
  >
    {props.categories.length > 0 && props.categories.map(category=> {
      return (
        <SwiperSlide className={styles.swiperSlide}>
          <div className={styles.categoryItem}>
            {category.image &&
              <Image 
              src={FILES+category.image.source} 
              alt={category.name+ ' image'} 
              width={'0'} 
              height="0"
              sizes="100vw"
              className={styles.image}
              />
            }
            <p className={styles.name}>{category.name}</p>
            <Button className={styles.artCounter}><span>{category.articlesCount} {Formatter.pluralize(+category.articlesCount, 'статья', 'статьи', 'статей' )}</span></Button>
          </div>
    </SwiperSlide>
      )
    })}


    </Swiper>
    <div className={styles.swiperNav}>
      <Button className={styles.buttonLeft} onClick={()=>swiper.current?.swiper.slidePrev()}><ArrowLeftSvg/></Button>
      <Button className={styles.buttonRight} onClick={()=>swiper.current?.swiper.slideNext()}><ArrowRightSvg/></Button>
    </div>
    <Button className={styles.watchAll}>Смотреть все</Button>
  </section>
  )
}