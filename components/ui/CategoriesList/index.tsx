import styles from './index.module.scss'

// import { IFile } from 'data/interfaces/Common'
import Image from 'next/image'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import {Autoplay} from 'swiper/modules'
import Button from 'components/ui/Button'
import Formatter from 'utils/formatter'
import { useRef } from 'react'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import LinkBlack from 'components/ui/LinkBlack'
import Link from 'next/link'
import classNames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import { FILES } from 'types/constants'

interface Props<T> {
  categories: T[]
  hideNav?: boolean
  className?: string
  title?: string
  articlesCounter?:boolean
}


export default function CategoriesList<T extends {[key: string]: any}>(props: Props<T>) {
  const swiper= useRef<SwiperRef>(null!)
  const {isTabletWidth} = useResize()

  return (
  <section className={classNames(styles.root, props.className)}> 
  <Swiper
  ref={swiper}
  freeMode={true}
  slidesPerView={'auto'}
  spaceBetween={10}
  autoplay={true}
  loop={true}
  modules={[Autoplay]}
  className={styles.swiper}
  >
    {props.categories.length > 0 && props.categories.map(category=> {
      return (
        <SwiperSlide className={styles.swiperSlide} key={category.id}>
          <Link href={`/media/page?page=categories&category=${category.id}`} replace={true} className={styles.categoryItem}>
            <div className={styles.imageWrapper}>
              <Image 
              src={FILES + category.image.source}
              alt={category.name+ ' image'} 
              width={100} 
              height={100}
              style={{objectFit:'cover', width: '100%', height: '100%'}}
              className={styles.image}
              />
            </div>
            <p className={styles.name} title={category.name}>{category.name}</p>
            {props.articlesCounter && category.articlesCount &&
              <div  className={styles.artCounter} ><span>{category.articlesCount} {Formatter.pluralize(+category.articlesCount, 'статья', 'статьи', 'статей' )}</span></div>
            }
          </Link>
        </SwiperSlide>
      )
    })}
    </Swiper>
    {/* {!props.hideNav && !isTabletWidth &&
      <> */}
        <Button title='prev slide button' className={styles.buttonLeft} onClick={()=>swiper.current?.swiper.slidePrev()}><ArrowLeftSvg/></Button>
        <Button title='next slide button' className={styles.buttonRight} onClick={()=>swiper.current?.swiper.slideNext()}><ArrowRightSvg/></Button>
      {/* </>
    } */}
    {!props.hideNav && !isTabletWidth &&
      <LinkBlack href={'/media/page?page=categories'}>Смотреть все</LinkBlack>
    }
  </section>
  )
}