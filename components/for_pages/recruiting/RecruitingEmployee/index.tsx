import styles from './index.module.scss'

import Link from 'next/link'
import Title from 'components/ui/TitleForSection'
import Button from 'components/ui/Button'
import Possibilities from './Possibilities'
import AppPromo from '../sections/AppPromo'
import Help from '../sections/Help'
import Search from '../sections/Search'
import recruitingCatCompanies from 'images/recruiting/recruitingCatCompanies.png'
import Rive  from '@rive-app/react-canvas'
import { useEffect, useMemo, useState } from 'react'
import slide3 from 'images/recruiting/recruiting_swipe3.png'
import slide4 from 'images/recruiting/recruiting_swipe4.png'
import slide5 from 'images/recruiting/recruiting_swipe5.png'
import { useAppContext } from 'context/state'
import SearchBar from 'components/ui/SearchBar'
import dynamic from 'next/dynamic'
import { IVacancy } from 'data/interfaces/IVacancy'
import { ISpecializationCategory } from 'data/interfaces/Common'
import ICourse from 'data/interfaces/ICourse'
import { IArticle } from 'data/interfaces/IArticle'
import CoursesRepository from 'data/repositories/CoursesRepository'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { Languages } from 'types/enums'
import ArticlesList from '../../index/ArticlesList'
import CoursesList from '../../index/CoursesList'
import Spacer from '@/components/ui/Spacer'
import recruitingCatWallet from 'images/recruiting/scene4.png'
import recruitingCatPoint from 'images/recruiting/scene1.png'
import recruitingCatMessage from 'images/recruiting/scene3.png'


const Categories = dynamic(() => import('../sections/Categories'), {
  ssr: false
})

interface Props {
  vacancies?: IVacancy[]
}




export default function RecruitingEmployee(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const [categories, setCategories] = useState<Map<number, ISpecializationCategory>>(new Map)
  const [popularCourses, setPopularCourses] = useState<Map<number, ICourse>>(new Map)
  const [news, setNews] = useState<Map<number, IArticle>>(new Map)
  const [load, setLoad] = useState<boolean>(false)



  const riveAnimation = useMemo(()=>{
    return <Rive 
    src={'/rive/cv_laptop.riv'} 
    animations={[   
      'Money3',
      'Money2',
      'Money1',
      'MoneyLoop',
      'Laptop',
      'HandR',
      'HandL',
      'Head',
      'Eyes',
      'Boot',]} 
    className={styles.image}/>
  }, [])

  const init = async() => {
    const [ courses, news] = await Promise.all([
      CoursesRepository.getCourses({page: 1, limit: 20},Languages.ru),
      ArticlesRepository.getNews(true, {page: 1, limit: 20, isTop: false}),
    ])

    setPopularCourses(state => {
      courses.data.forEach(c => {
        state.set(c.id, c)
      })
      return state
    })
    setNews(state => {
      news.data.forEach(el => {
        state.set(el.id, el)
      })
      return state
    })

    setTimeout(()=> {
      setLoad(true)
    }, 100)
  }

  useEffect(()=>{
    init()
  }, [])
  

  return (<div className={styles.root}> 
    {isTabletWidth && <SearchBar placeholder='Поиск вакансий'/>}
    <div className={styles.top}>
      {riveAnimation}
      <h2 className={styles.title}>
        Найдите работу мечты 
        <span className={styles.title_big}> в <span className={styles.title_purple}>Arbi</span>Hunter</span>
      </h2>
      {/* <p className={styles.description}>
        Ежедневно более 1000 людей находят работу в ArbiHunter которая позволяет им расти и становиться успешными!
      </p>
      <div className={styles.found}>
        <Image src={usersTopEmployee} alt={''}/>
        <p>
          <span className={styles.found_bold}>+25 500</span> <br/> уже нашли
        </p>
      </div> */}
      <Link className={styles.createLink} href={'/create/cv'} ><span>Создать резюме</span></Link>
    </div>

    {!isTabletWidth && <Search title={'Поиск вакансий'} tags={['Media Buyer', 'Affiliate Manger', 'Sales Manager', 'Team Lead']}/>}
    
    <Title title="Поиск по популярным категориям" className={styles.title}/>
    <Categories count='вакансий' image={recruitingCatCompanies} titles={['CPA-сети', 'Маркетинг', 'Media Buying']} images={[recruitingCatWallet, recruitingCatPoint, recruitingCatMessage]}/>
    {!isTabletWidth &&
      <Button className={styles.watchAll}>Смотреть все</Button>
    }

    <Possibilities/>

    <Title title={'Полезные статьи'} className={styles.title}/>
    <Spacer basis={40}/>
    {news.size > 0 &&
      <ArticlesList news={[...news.values()]}/>
    }
    {!isTabletWidth &&
      <Button className={styles.watchAll}>Смотреть все</Button>
    }

    <Title title={'Бесплатные курсы'} className={styles.title}/>
    <Spacer basis={40}/>
    {popularCourses.size > 0 &&
      <CoursesList courses={[...popularCourses.values()]}/>
    }
    {/* {props.vacancies.length > 0 &&  
    <>
      <Title title={'Вакансии дня'} className={styles.title}/>
      <Vacancies vacancies={props.vacancies}/>
    </>
    } */}
    {!isTabletWidth &&
      <Button className={styles.watchAll}>Смотреть все</Button>
    }

    <AppPromo cards={[slide3, slide4, slide5]}/>

    <Help/>
  </div>)
}