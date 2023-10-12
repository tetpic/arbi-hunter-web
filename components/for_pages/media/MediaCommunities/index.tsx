import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import {Autoplay} from 'swiper/modules'
import ICommunity from 'data/interfaces/ICommunity'
import Image from 'next/image'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import { useRouter } from 'next/router'
import Button from 'components/ui/Button'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import { useRef } from 'react'
import styles from './index.module.scss'
import LinkBlack from 'components/ui/LinkBlack'

interface Props {
  communities: ICommunity[]
}

export default function MediaCommunities(props: Props) {
  
  const router = useRouter()
  const swiper = useRef<SwiperRef>(null!)


  return (<div className={styles.root}> 
  <p className={styles.title}>Сообщества</p>
  <div className={styles.content}>
    <Swiper
    autoplay
    loop
    slidesPerView={'auto'}
    freeMode
    modules={[Autoplay]}
    ref={swiper}
    className={styles.swiper}
    >
      {props.communities&& props.communities.map(comm => {
        return (
          <SwiperSlide className={styles.slide} key={comm.id}>
            <div className={styles.item} onClick={()=>{router.push(`/communities/${comm.id}`)}}>
              <div className={styles.imageWrapper}>
                {comm.image&& 
                  <Image 
                  src={FILES + comm.image.source} 
                  alt={comm.name + ' background'} 
                  width={286} 
                  height={134} 
                  style={{objectFit:'cover'}}
                  // layout="fill"
                  // objectFit="cover"
                  />
                }
              </div>
              <div className={styles.logoWrapper}>
                <div className={styles.logo}>
                  {comm.logo&&<Image src={FILES+comm.logo.source}  width={52} height={52} alt={comm.name + ' logo'}/>}
                </div>
              </div>
              <p className={styles.name}>{comm.name}</p>
              <p className={styles.stats}>{comm.membersCount} {Formatter.pluralize(+comm.membersCount, 'подписчик', 'подписчика', 'подписчиков')}</p>
            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
    <Button 
    className={styles.buttonLeft} 
    title='previous slide'
    onClick={(e)=>{
      swiper.current.swiper.slidePrev()
    }}
    >
      <ArrowLeftSvg/>
    </Button>

    <Button 
    className={styles.buttonRight} 
    title='next slide'
    onClick={e=> {
      swiper.current.swiper.slideNext()
    }}
    >
      <ArrowRightSvg/>
    </Button>
  </div>
  <LinkBlack href={'/communities'} >Смотреть все</LinkBlack>

  </div>)
}