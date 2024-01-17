import styles from './index.module.scss'

import { ICourseFeedback } from 'data/interfaces/ICourse'
import { Swiper, SwiperSlide } from 'swiper/react'
import RatingLine from 'components/ui/RatingLine'
import Link from 'next/link'
import Image from 'next/image'
import { FILES } from 'types/constants'
import dollasMan from 'images/dollarS_man.png'
import { useResize } from 'components/hooks/useResize'

interface Props {
  feedbacks: ICourseFeedback[]
}

export default function Feedbacks(props: Props) {
  const {isTabletWidth} = useResize()

  return (<div className={styles.root}> 
    <Swiper
    className={styles.swiper}
    autoplay={true}
    loop={true}
    slidesPerView={'auto'}
    freeMode={true}
    spaceBetween={16}
    >
      {props.feedbacks.map(item=> {
        return (
            <SwiperSlide key={item.id} className={styles.swiperSlide}>
              <div className={styles.item}>
                <div className={styles.imageWrapper}>
                  {item.profile.image &&
                    <Image 
                    src={FILES + item.profile.image.source} 
                    alt={item.profile.firstName}
                    width={176}
                    height={250}
                    style={{objectFit: 'cover', height: '100%', width: '100%'}}
                    />
                    ||
                    <Image 
                    src={dollasMan} 
                    alt={'defaultPicture'}
                    width={176}
                    height={250}
                    style={{objectFit: 'cover', height: '100%', width: '100%' }}
                    />
                  }
                </div>
                <div className={styles.content}>
                  <p className={styles.name}>{item.profile.firstName} {item.profile.lastName} &#183; {item.profile.city.locName} </p>
                  <RatingLine  rating={item.mark} starClass={styles.star}/>
                  <p className={styles.feedback}>{item.content}</p>
                  <Link className={styles.link} href={'/courses/'+item.course.id}> <span>Курс: &quot;{item.course.name}&quot;</span></Link>
                </div>
              </div>
            </SwiperSlide>
          )
      })}
    </Swiper>

  </div>)
}
