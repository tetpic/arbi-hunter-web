import styles from './index.module.scss'

import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { IArticle } from 'data/interfaces/IArticle'
import Image from 'next/image'
import { FILES } from 'types/constants'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { IStoriesViewerProps } from 'components/modals/StoriesViewerModal'
import { useRef } from 'react'
import Button from '../Button'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'
import classNames from 'classnames'

interface Props {
  stories: IArticle[]
  className?: string
}

export default function Stories(props: Props) {
  const stories = props.stories
  const swiperRef= useRef<SwiperRef>(null!)

  const appContext = useAppContext()

  const openStoriesViewer = (story: IArticle) => {
    appContext.showModal<IStoriesViewerProps>(ModalType.StoriesViewerModal, {
      stories: stories,
      currentStory: story
    })
  }

  return (<div className={classNames(styles.root, props.className)}> 
    <div className={styles.content}>
      <Swiper
      ref={swiperRef}
      slidesPerView={'auto'}
      spaceBetween={8}
      loop
      freeMode={true}
      modules={[Autoplay]}
      className={styles.swiper}
      >
        {[...stories, ...stories].map((el, index)=> {
          return (
            <SwiperSlide key={index} className={styles.swiperSlide}>
              <div className={styles.item} onClick={()=>openStoriesViewer(el)}>
                <div className={styles.imageWrapper}>
                  <Image src={FILES + el.image.source } alt={el.name} width={200} height={200} style={{objectFit: 'cover', width: '100%', height: '100%'}}/>
                </div>
                <p className={styles.description}>
                  {el.name}
                </p>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <Button className={styles.leftButton} onClick={()=>swiperRef.current.swiper.slidePrev()}><ArrowLeftSvg/></Button>
      <Button className={styles.rightButton} onClick={()=> swiperRef.current.swiper.slideNext()}><ArrowRightSvg/></Button>
    </div>
  </div>)
}