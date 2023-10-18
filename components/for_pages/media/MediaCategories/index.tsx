import { ICategory } from 'data/interfaces/Common'
import Image from 'next/image'
// import { FILES } from 'types/constants'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import {Autoplay} from 'swiper/modules'
import Button from 'components/ui/Button'
import Formatter from 'utils/formatter'
import { useRef } from 'react'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import styles from './index.module.scss'
import LinkBlack from 'components/ui/LinkBlack'
import bigBitcoin from 'images/big_bitcoin.png'
import Link from 'next/link'

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
        <SwiperSlide className={styles.swiperSlide} key={category.id}>
          <div className={styles.categoryItem}>
            <div className={styles.imageWrapper}>
                <Image 
                src={bigBitcoin}
                alt={category.name+ ' image'} 
                width={100} 
                height={100}
                style={{objectFit:'cover'}}
                className={styles.image}
                />
            </div>
            <p className={styles.name} title={category.name}>{category.name}</p>
            <Link  className={styles.artCounter} href={`media/page?category=${category.id}`}><span>{category.articlesCount} {Formatter.pluralize(+category.articlesCount, 'статья', 'статьи', 'статей' )}</span></Link>
          </div>
        </SwiperSlide>
      )
    })}
    </Swiper>
    <Button title='prev slide button' className={styles.buttonLeft} onClick={()=>swiper.current?.swiper.slidePrev()}><ArrowLeftSvg/></Button>
    <Button title='next slide button' className={styles.buttonRight} onClick={()=>swiper.current?.swiper.slideNext()}><ArrowRightSvg/></Button>
    <LinkBlack href={'/categories'}>Смотреть все</LinkBlack>
  </section>
  )
}