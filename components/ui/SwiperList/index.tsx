import { Swiper, SwiperProps, SwiperRef, SwiperSlide } from 'swiper/react'
import styles from './index.module.scss'
import classNames from 'classnames'
import { useAppContext } from 'context/state'
import { useRef } from 'react'
import {Autoplay} from 'swiper/modules'
import Button from '../Button'
import LinkBlack from '../LinkBlack'
import ArrowLeftSvg from '@/components/svg/ArrowLeftSvg'
import ArrowRightSvg from '@/components/svg/ArrowRightSvg'


interface Props {
  children: JSX.Element[]
  className?: string
  hideNav?: boolean
  slideClassName?: string
  swiperProps?: SwiperProps
}

export default function SwiperList(props: Props) {
  const swiper= useRef<SwiperRef>(null!)
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size


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
    {...props.swiperProps}
    >
      {props.children.length > 0 && props.children.map(item=> {
        return (
          <SwiperSlide className={props.slideClassName||styles.swiperSlide} >
            {item}
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