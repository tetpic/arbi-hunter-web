import styles from './index.module.scss'

import Title from 'components/ui/TitleForSection'
import MainSearchBar from '@/components/ui/MainSearchBar'
import { Swiper, SwiperSlide } from 'swiper/react'
import P from '@/components/ui/P'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import classNames from 'classnames'
import { useRouter } from 'next/router'

interface Props {
  title: string
  tags?: string[]
}

export default function Search(props: Props) {
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light
  const router = useRouter()

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
        <P onClick={()=>router.push('/registration')} styleType={['medium', 'w500', ]} useThemeColor  className={classNames(styles.tag, isLightTheme&&styles.tag_light)}>{el}</P>
        </SwiperSlide>
      })}
      </Swiper>
    </div>
    <MainSearchBar placeholder={props.title} className={styles.searchBar}/>
  </div>
  )
}