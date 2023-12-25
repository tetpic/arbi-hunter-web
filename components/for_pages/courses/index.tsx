import styles from './index.module.scss'

import Image from 'next/image'
import { useCoursesContext } from 'context/courses_state'
import { useEffect, useMemo } from 'react'
import Formatter from 'utils/formatter'
import { ICategory } from 'data/interfaces/Common'
import Categories from './Categories'
import ICourse, { ICourseFeedback } from 'data/interfaces/ICourse'
import CoursesBlock from './CoursesBlock'
import Benefits from './Benefits'
import Banner from './Banner'
import SearchBar from 'components/ui/SearchBar'
import Feedbacks from './Feedbacks'
import LinkBlack from 'components/ui/LinkBlack'
import { useResize } from 'components/hooks/useResize'
import Title from 'components/ui/TitleForSection'
import Tag from 'components/ui/Tag'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { ICoursesCategoriesModalProps } from 'components/modals/CoursesCategoriesModal'
import { useRouter } from 'next/navigation'
import Stories from 'components/ui/Stories'
import { useMediaContext } from 'context/media_state'


interface Props {
  categoryList: ICategory[]
  courses: ICourse[]
  compilations: ICategory[]
  popularCourses: ICourse[]
  feedbacks: ICourseFeedback[]
}

export default function CoursesMain(props: Props) {
  const coursesContext = useCoursesContext()
  const appContext  = useAppContext()
  const mediaContext = useMediaContext()
  const popularCourses = props.popularCourses
  const {isTabletWidth} = useResize()
  const router = useRouter()

  const randomCategories = useMemo(()=>Formatter.randomElementsFromArray<ICategory>(coursesContext.categories, 4), [coursesContext.categories])

  const openCategoriesModal = () => {
    appContext.showModal<ICoursesCategoriesModalProps>(ModalType.CoursesCategoriesModal, {
      onCategoryClick:  (categoryId: number) => {
        router.push('/courses/compilations?page=categories&category='+categoryId)
      }
    })
  }

  useEffect(()=>{
    coursesContext.setCoursesCategories(props.categoryList)
    coursesContext.setCourses(null, props.courses)
    mediaContext?.setStories&&mediaContext?.setStories(null, 'course')
  }, [])

  return <div className={styles.root}> 
    {isTabletWidth &&
    <>
      <Title title={'Онлайн обучение'} className={styles.navTitle} onBackClick={()=>router.push('/')} />
      <SearchBar className={styles.search}/>
    </>
    }
    <div className={styles.top}>
      <h1 className={styles.title}>Станьте<br/> востребованным<br/> специалистом</h1>
      <div className={styles.tagsWrapper}>
        {coursesContext.categories.length > 0 &&
          randomCategories.map(el=> {
            return  (
              <Tag className={styles.tag} text={el.name} link={'/courses/compilations?page=categories&category='+el.id}/>
            )
          })
        }
      </div>
      <div className={styles.imageWrapper}>
        <Image className={styles.coursesImage} src={'/images/courses/head.png'} width={340} height={340} alt={'courses image'}/>
        <Image className={styles.coursesImage} src={'/images/courses/paper.png'} width={340} height={340} alt={'courses image'}/>
      </div>
    </div>
    {!isTabletWidth &&
      <SearchBar className={styles.search}/>
    }

    <Benefits/>

    {mediaContext.stories && mediaContext.stories.size > 0 &&
      <>
        <Title title={'Истории'} className={styles.sectionTitle}/>
        <Stories className={styles.stories} stories={[...mediaContext.stories?.values()]}/>
      </>
      
    }

    <Title className={styles.sectionTitle} onAllWatchClick={()=> openCategoriesModal()} title={'Категории'}/>
    <Categories categoryList={props.categoryList} className={styles.categories}/>
    {!isTabletWidth &&
    <LinkBlack href='/courses/compilations?page=categories'>Смотреть все</LinkBlack>
    }

    <Title 
    className={styles.sectionTitle} 
    title={isTabletWidth?'Подборки':'Подборки для вас'} 
    link='/courses/compilations?page=categories'
    emoji={!isTabletWidth&&<Image src={'/icons/diamond.png'} alt={'diamond'} width={32} height={32}/>}
    />
    <section className={styles.banners}>
      <div className={styles.bannersWrapper}>
        {isTabletWidth &&
        <Swiper
        spaceBetween={16}
        className={styles.bannersSlider}
        slidesPerView={'auto'}
        >
          <SwiperSlide className={styles.slide}>
            <Banner className={styles.banner} colorGradient={['#37BFAE', '#7D5CFF']} category={props.compilations[0]}/>
          </SwiperSlide >
          <SwiperSlide className={styles.slide}>
            <Banner className={styles.banner} colorGradient={['#AD36C7', '#7D5CFF']} category={props.compilations[1]}/>
          </SwiperSlide>
          <SwiperSlide className={styles.slide}>
            <Banner className={styles.banner} colorGradient={['#9365CA', '#4E5FBF']} category={props.compilations[2]}/>
          </SwiperSlide>
        </Swiper>
        ||
        <>
        <Banner className={styles.banner_small} colorGradient={['#37BFAE', '#7D5CFF']} category={props.compilations[0]}/>
        <Banner className={styles.banner_small} colorGradient={['#AD36C7', '#7D5CFF']} category={props.compilations[1]}/>
        <Banner className={styles.banner_large} colorGradient={['#9365CA', '#4E5FBF']} category={props.compilations[2]}/>
        </>}
      </div>
    </section>
    {!isTabletWidth &&
      <LinkBlack href='/courses/compilations?page=categories'>Смотреть все</LinkBlack>
    }

    <Title className={styles.sectionTitle} title={isTabletWidth?'Отзывы':'Отзывы учеников'} link='/feedbacks'/>
    <Feedbacks feedbacks={props.feedbacks}/>
    {!isTabletWidth &&
      <LinkBlack href={'/feedbacks'}>Смотреть все</LinkBlack>
    }

    <Title 
    title={isTabletWidth?'Популярное':'Популярные курсы'}
    link='/courses/compilations?page=all'
    className={styles.sectionTitle} 
    emoji={!isTabletWidth&&<Image src={'/icons/diamond.png'} alt={'diamond'} width={32} height={32}/>}
    />
    <CoursesBlock courses={popularCourses}/>
    {!isTabletWidth &&
    <LinkBlack href='/courses/compilations?page=all'>Смотреть все</LinkBlack>
    }
  </div>
}