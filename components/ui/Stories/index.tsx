import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './index.module.scss'
import { Autoplay } from 'swiper/modules'
import { IArticle } from 'data/interfaces/IArticle'
import Image from 'next/image'
import { FILES } from 'types/constants'

interface Props {
  stories: IArticle[]
}

export default function Stories(props: Props) {
  const stories = props.stories.length < 15?[...props.stories, ...props.stories, ...props.stories, ...props.stories]:props.stories

  return (<div className={styles.root}> 
    <div className={styles.content}>
      <Swiper
      slidesPerView={'auto'}
      loop={true}
      spaceBetween={8}
      autoplay={true}
      loopedSlides={16}
      freeMode={true}
      modules={[Autoplay]}
      >
        {stories.map(el=> {
          return (
            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.item}>
                <div className={styles.imageWrapper}>
                  <Image src={FILES + el.image.source } alt={el.name} width={200} height={200} style={{objectFit: 'cover', width: '100%', height: '100%'}}/>
                  {/* image */}
                </div>
                <p className={styles.description}>
                  {el.name}
                </p>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>

  </div>)
}