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
          <Image className={styles.background} src={'/images/cities/thailand.png'} alt={''} width={770} height={170} />
          <Image src={'/images/buildings/building1.png'}  style={{objectFit: 'contain'}} className={styles.buildings} width={200} height={170} alt={''} />
          <Rive className={styles.rive} animations={['ShowBack1', 'ShowBack2', 'ShowBack3', 'ShowBack4', 'Plain' ]}  src={'/rive/header_airplane.riv'}/>
          <Rive className={styles.rive}  src={'/rive/header_particles3.riv'}/>
        </SwiperSlide>

        <SwiperSlide className={styles.slide}>
          <Image className={styles.background} src={'/images/cities/moscow.png'} alt={''}  width={770} height={170}/>
          <Image src={'/images/buildings/building3.png'}  style={{objectFit: 'contain'}} className={styles.buildings} width={200} height={170} alt={''} />
          <Rive className={styles.rive} animations={['ShowBack1', 'ShowBack2', 'ShowBack3', 'ShowBack4', 'HeliProp', 'HeliTrail', 'Heli']}  src={'/rive/header_helicopter.riv'}/>
          <Rive className={styles.rive}  src={'/rive/header_particles2.riv'}/>
        </SwiperSlide>

        <SwiperSlide className={styles.slide}>
          <Image className={styles.background} src={'/images/cities/newyork.png'} alt={''} width={770} height={170}/>
          <Image src={'/images/buildings/building2.png'}  style={{objectFit: 'contain'}} className={styles.buildings} width={200} height={170} alt={''} />
          <Rive className={styles.rive} animations={['ShowBack1', 'ShowBack2', 'ShowBack3', 'Boat', 'BoatTrail', 'BoatFloating', 'ShowBack4',]}  src={'/rive/header_boat.riv'}/>
          <Rive className={styles.rive}  src={'/rive/header_particles3.riv'}/>
        </SwiperSlide>
      
        <SwiperSlide>
          <Image className={styles.background} src={'/images/cities/dubai.png'} alt={''} width={770} height={170} />
          <Image src={'/images/buildings/building3.png'} style={{objectFit: 'contain'}} className={styles.buildings} width={200} height={170} alt={''} />
          <Rive className={styles.rive} animations={['ShowBack1', 'Car', 'CarTrails', 'ShowBack2', 'CarWheels', 'ShowBack3', 'ShowBack4']} src={'/rive/header_car.riv'}/>
          <Rive className={styles.rive}  src={'/rive/header_particles4.riv'}/>
        </SwiperSlide>

      </Swiper>          
    </div>
  </div>
  )
}