import styles from './index.module.scss'
import { IVacancy } from 'data/interfaces/IVacancy'
import VacancyItem from 'components/ui/VacancyItem'
import { Swiper, SwiperSlide } from 'swiper/react'


interface Props {
  vacancies?: IVacancy[]
}

export default function Vacancies(props: Props) {

  return (<section className={styles.vacancies}>
    <Swiper
    slidesPerView={'auto'}
    spaceBetween={16}
    className={styles.swiper}
    >
    {props.vacancies?.map(vacancy=>
      <SwiperSlide className={styles.slide}>
        <VacancyItem key={vacancy.id} vacancy={vacancy}/>
      </SwiperSlide>
    )}
    </Swiper>
  </section>)
}