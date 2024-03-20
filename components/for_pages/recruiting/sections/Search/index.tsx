import styles from './index.module.scss'

import Title from 'components/ui/TitleForSection'
import MainSearchBar from '@/components/ui/MainSearchBar'
import { Swiper, SwiperSlide } from 'swiper/react'
import P from '@/components/ui/P'

interface Props {
  title: string
  tags?: string[]
}

export default function Search(props: Props) {

  return (<div className={styles.search}>
    <Title title={props.title} className={styles.smallTitle}/>
    <div className={styles.tags}>
      <Swiper
      slidesPerView={'auto'}
      spaceBetween={8}
      className={styles.swiper}
      >
        

      {props.tags.map(el => {
        return <SwiperSlide className={styles.slide}>
        <P styleType={['medium', 'w500', ]} useThemeColor  className={styles.tag}>{el}</P>
        </SwiperSlide>
      })}
      </Swiper>
      {/* <p className={styles.tag}>Разработка</p>
      <p className={styles.tag}>Affiliate Manger</p>
      <p className={styles.tag}>Frontented-Разработчик</p>
      <p className={styles.tag}>SMM-менеджер</p> */}
    </div>
    <MainSearchBar placeholder={props.title} className={styles.searchBar}/>
  </div>
  )
}