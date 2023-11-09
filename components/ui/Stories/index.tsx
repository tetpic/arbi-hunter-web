import styles from './index.module.scss'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { IArticle } from 'data/interfaces/IArticle'
import Image from 'next/image'
import { FILES } from 'types/constants'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { IStoriesViewerProps } from 'components/modals/StoriesViewerModal'

interface Props {
  stories: IArticle[]
}

export default function Stories(props: Props) {
  //for test
  const stories = props.stories/*.length < 15?[...props.stories, ...props.stories, ...props.stories, ...props.stories]:props.stories*/

  const appContext = useAppContext()

  const openStoriesViewer = (story: IArticle) => {
    appContext.showModal<IStoriesViewerProps>(ModalType.StoriesViewerModal, {
      stories: stories,
      currentStory: story
    })
  }



  return (<div className={styles.root}> 
    <div className={styles.content}>
      <Swiper
      slidesPerView={'auto'}
      spaceBetween={8}
      freeMode={true}
      modules={[Autoplay]}
      >
        {stories.map(el=> {
          return (
            <SwiperSlide className={styles.swiperSlide}>
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
    </div>

  </div>)
}