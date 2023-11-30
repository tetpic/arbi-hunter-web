import styles from './index.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import Rive from '@rive-app/react-canvas'
import Image from 'next/image'


interface Props {
}

export default function Buildings(props: Props) {

  return (
  <div className={styles.imageSettings}>
    <div className={styles.top}>
      <Swiper className={styles.swiper} >
        <SwiperSlide className={styles.slide}>
          <Image src={'/images/cities/thailand.png'} alt={''} width={770} height={170} />
          <Image src={'/images/buildings/building1.png'}  style={{objectFit: 'contain'}} className={styles.buildings} width={200} height={170} alt={''} />
          <Rive className={styles.rive}  src={'/rive/header_airplain.riv'}/>
          <Rive className={styles.rive}  src={'/rive/header_particles3.riv'}/>
        </SwiperSlide>

        <SwiperSlide className={styles.slide}>
          <Image src={'/images/cities/moscow.png'} alt={''}  width={770} height={170}/>
          <Image src={'/images/buildings/building3.png'}  style={{objectFit: 'contain'}} className={styles.buildings} width={200} height={170} alt={''} />
          <Rive className={styles.rive}  src={'/rive/header_boat.riv'}/>
          <Rive className={styles.rive}  src={'/rive/header_particles2.riv'}/>
        </SwiperSlide>

        <SwiperSlide className={styles.slide}>
          <Image src={'/images/cities/newyork.png'} alt={''} width={770} height={170}/>
          <Image src={'/images/buildings/building2.png'}  style={{objectFit: 'contain'}} className={styles.buildings} width={200} height={170} alt={''} />

          <Rive className={styles.rive}  src={'/rive/header_helicopter.riv'}/>
          <Rive className={styles.rive}  src={'/rive/header_particles3.riv'}/>
        </SwiperSlide>
      
        <SwiperSlide>
          <Image src={'/images/cities/dubai.png'} alt={''} width={770} height={170} />
          <Image src={'/images/buildings/building3.png'} style={{objectFit: 'contain'}} className={styles.buildings} width={200} height={170} alt={''} />

          <Rive className={styles.rive}  src={'/rive/header_particles4.riv'}/>
        </SwiperSlide>

      </Swiper>          
    </div>
  </div>
  )
}