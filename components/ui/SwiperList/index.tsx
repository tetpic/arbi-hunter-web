import { Swiper, SwiperProps, SwiperRef, SwiperSlide } from 'swiper/react'
import styles from './index.module.scss'
import classNames from 'classnames'
import { useAppContext } from 'context/state'
import { useRef } from 'react'
import {Autoplay, FreeMode} from 'swiper/modules'
import Button from '../Button'
import LinkBlack from '../LinkBlack'
import ArrowLeftSvg from '@/components/svg/ArrowLeftSvg'
import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import useTranslation from 'next-translate/useTranslation'


interface Props {
  children: JSX.Element[]|JSX.Element
  className?: string
  wrapperClassName?: string
  hideNav?: boolean
  hideWatchMore?: boolean
  slideClassName?: string
  swiperClassname?: string
  swiperProps?: SwiperProps
}

export default function SwiperList(props: Props) {
  const swiper= useRef<SwiperRef>(null!)
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const {t} = useTranslation()


  return (
    <section className={classNames(styles.root, props.className)}> 
    <Swiper
    ref={swiper}
    freeMode={true}
    slidesPerView={'auto'}
    spaceBetween={10}
    autoplay={true}
    loop={true}
    modules={[Autoplay, FreeMode]}
    className={classNames(styles.swiper, props.swiperClassname)}
    wrapperClass={props.wrapperClassName}
    {...props.swiperProps}
    >
      {Array.isArray(props.children) &&props.children.length > 0 && props.children.map(item=> {
        return (
          <SwiperSlide className={props.slideClassName||styles.swiperSlide} >
            {item}
          </SwiperSlide>
        )
      })
      ||
      <SwiperSlide className={props.slideClassName||styles.swiperSlide} >
        {props.children}
      </SwiperSlide>
      }
      </Swiper>
      {!props.hideNav && 
        <>
          <Button title='prev slide button' className={styles.buttonLeft} onClick={()=>swiper.current?.swiper.slidePrev()}><ArrowLeftSvg/></Button>
          <Button title='next slide button' className={styles.buttonRight} onClick={()=>swiper.current?.swiper.slideNext()}><ArrowRightSvg/></Button>
        </>
      }
      {!props.hideWatchMore && !isTabletWidth &&
        <LinkBlack href={'/media/page?page=categories'}>{t('watchAll')}</LinkBlack>
      }
    </section>
  
  
  )
}