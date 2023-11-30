import styles from './index.module.scss'

import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import { useCharacterContext } from 'context/character_state'
import { useEffect } from 'react'
import ThreeModelVariant from 'components/for_pages/three'

interface Props {
}

export default function Rooms(props: Props) {
  const characterContext = useCharacterContext()

  useEffect(()=>{
    characterContext.init()
  }, [])

  return (<div className={styles.root}> 
    <div className={styles.top}>
      <Swiper>
        <SwiperSlide>
          <Image src={'/images/rooms/office.png'} alt={'office'} width={770} height={134} style={{objectFit: 'cover'}}/>
        </SwiperSlide>
        <SwiperSlide>
          <Image src={'/images/rooms/coworking.png'} alt={'office'} width={770} height={134} style={{objectFit: 'cover'}}/>
        </SwiperSlide>
        <SwiperSlide>
          <Image src={'/images/rooms/home.png'} alt={'office'} width={770} height={134} style={{objectFit: 'cover'}}/>
        </SwiperSlide>
      </Swiper>
    </div>
    <div className={styles.bottom}>
      <div className={styles.userPic}>
        <ThreeModelVariant {...characterContext.variant} r={0}/>
      </div>
    </div>
  </div>)
}