import styles from './index.module.scss'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import Rive from '@rive-app/react-canvas'
import Image from 'next/image'
import { IUserProfile } from 'data/interfaces/IUser'
import { BackgroundCategoryType, IBackground } from 'data/interfaces/IBackground'
import { useEffect, useState } from 'react'
import BackgroundRepository from 'data/repositories/BackgroundsRepository'
import { FILES } from 'types/constants'
import { ProfileType } from 'data/interfaces/IRegistration'


interface Props {
  profile?: IUserProfile
}

export default function Buildings(props: Props) {
  const [background, setBackground] = useState<IBackground>()
  
  useEffect(()=>{
    BackgroundRepository.getBackground({categoryId: BackgroundCategoryType.Places, profileId: props.profile?.id})  
    .then(res => {
      setBackground(res[0])
    })
  }, [])
  

  return (
  <div className={styles.imageSettings}>

    {background &&
      <Image className={styles.background} src={FILES + background.image.source} alt={'back'} width={770} height={300} />
    }
    {
      background && props.profile.image && props.profile.logo && props.profile.profileType === ProfileType.Hirer &&
      <div className={styles.buildingWrapper}>
        <Image className={styles.building} src={FILES + props.profile.image.source} width={250} height={300} alt={''}/>
        <Image 
        className={styles.logo} 
        src={FILES + props.profile.logo.source} 
        width={60} height={60} 
        style={{top: props.profile.image.focalPoint.y*100+'%', left: props.profile.image.focalPoint.x*100+'%'}}
        alt={''}/>
      </div>
      ||
      props.profile.profileType === ProfileType.Employee && props.profile.useOwnLogo && props.profile.logo &&
      <Image 
      src={FILES + props.profile.logo.source}
      alt={''} width={300} height={300}
      className={styles.userLogo}
      />
    }

    {/* <div className={styles.top}>
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
    </div> */}
  </div>
  )
}