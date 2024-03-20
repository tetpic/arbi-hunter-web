import { useAppContext } from 'context/state'
import styles from './index.module.scss'
import Image, { StaticImageData } from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { AppTheme } from 'types/enums'
import classNames from 'classnames'


interface Props {
  image: string| StaticImageData
  count: string
  titles: [string, string, string]
  images: [StaticImageData, StaticImageData, StaticImageData]
}

export default function Categories(props: Props) {
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light

  return (<div className={styles.categories}>
    <Swiper
    slidesPerView={'auto'}
    spaceBetween={16}
    className={styles.swiper}
    >
    <SwiperSlide className={classNames(styles.item, isLightTheme&&styles.item_light)}>
    <div >
      <p className={styles.item__title}>{props.titles[0]}</p>
      <Image className={styles.item__image} src={props.images[0]} alt='' width={120} height={120}/>
      <div className={styles.item__bottom}>
        <Image src={props.image} alt={''} width={163} height={56}/>
      </div>
    </div>
    </SwiperSlide>

    <SwiperSlide className={classNames(styles.item, isLightTheme&&styles.item_light)}>
    <div >
      <p className={styles.item__title}>{props.titles[1]}</p>
      <Image className={styles.item__image} src={props.images[1]} alt='' width={120} height={120}/>
      <div className={styles.item__bottom}>
        <Image src={props.image} alt={''} width={163} height={56}/>
      </div>
    </div>
    </SwiperSlide>

    <SwiperSlide className={classNames(styles.item, isLightTheme&&styles.item_light)}>
    <div>
      <p className={styles.item__title}>{props.titles[2]}</p>
      <Image className={styles.item__image} src={props.images[2]} alt='' width={120} height={120}/>
      <div className={styles.item__bottom}>
        <Image src={props.image} alt={''} width={163} height={56}/>
      </div>
    </div>
    </SwiperSlide>

    </Swiper>
  </div>)
}