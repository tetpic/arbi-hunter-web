import styles from './index.module.scss'
import Image, { StaticImageData } from 'next/image'
import recruitingCatWallet from 'images/recruiting/recruitingCatWallet.png'
import recruitingCatPoint from 'images/recruiting/recruitingCatPoint.png'
import recruitingCatMessage from 'images/recruiting/recruitingCatMessage.png'
import { Swiper, SwiperSlide } from 'swiper/react'


interface Props {
  image: string| StaticImageData
  count: string
  titles: [string, string, string]
}

export default function Categories(props: Props) {

  return (<div className={styles.categories}>
    <Swiper
    slidesPerView={'auto'}
    spaceBetween={16}
    className={styles.swiper}
    >
    <SwiperSlide className={styles.item}>
    <div >
      <p className={styles.item__title}>{props.titles[0]}</p>
      <Image className={styles.item__image} src={recruitingCatWallet} alt='' width={150} height={128}/>
      <div className={styles.item__bottom}>
        <Image src={props.image} alt={''} width={122} height={55}/>
        <p>+423 {props.count}</p>
      </div>
    </div>
    </SwiperSlide>

    <SwiperSlide className={styles.item}>
    <div >
      <p className={styles.item__title}>{props.titles[1]}</p>
      <Image className={styles.item__image} src={recruitingCatPoint} alt='' width={150} height={128}/>
      <div className={styles.item__bottom}>
        <Image src={props.image} alt={''} width={122} height={55}/>
        <p>+423 {props.count}</p>
      </div>
    </div>
    </SwiperSlide>

    <SwiperSlide className={styles.item}>
    <div>
      <p className={styles.item__title}>{props.titles[2]}</p>
      <Image className={styles.item__image} src={recruitingCatMessage} alt='' width={150} height={128}/>
      <div className={styles.item__bottom}>
        <Image src={props.image} alt={''} width={122} height={55}/>
        <p>+423 {props.count}</p>
      </div>
    </div>
    </SwiperSlide>

    </Swiper>
  </div>)
}