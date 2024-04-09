import styles from './index.module.scss'

import Link from 'next/link'
import Title from 'components/ui/TitleForSection'
import Button from 'components/ui/Button'
import Possibilities from './Possibilities'
import AppPromo from '../sections/AppPromo'
import Help from '../sections/Help'
import Search from '../sections/Search'
import recruitingCatCompanies from 'images/recruiting/recruitingCatCompanies.png'
import recruitingCatCompaniesLight from 'images/recruiting/recruitingCatCompaniesLight.png'
import Rive  from '@rive-app/react-canvas'
import { useEffect, useMemo, useState } from 'react'
import slide3 from 'images/recruiting/recCard4.jpg'
import slide4 from 'images/recruiting/recCard5.jpg'
import slide5 from 'images/recruiting/recCard6.jpg'
import { useAppContext } from 'context/state'
import dynamic from 'next/dynamic'
import { IVacancy } from 'data/interfaces/IVacancy'
import ICourse from 'data/interfaces/ICourse'
import { IArticle } from 'data/interfaces/IArticle'
import CoursesRepository from 'data/repositories/CoursesRepository'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { AppTheme, Languages } from 'types/enums'
import ArticlesList from '../../index/ArticlesList'
import CoursesList from '../../index/CoursesList'
import s1 from 'images/recruiting/scene1.png'
import s1Light from 'images/recruiting/scene1Light.png'
import s2 from 'images/recruiting/scene2.png'
import s2Light from 'images/recruiting/scene2Light.png'
import s3 from 'images/recruiting/scene3.png'
import s3Light from 'images/recruiting/scene3Light.png'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'


const Categories = dynamic(() => import('../sections/Categories'), {
  ssr: false
})

interface Props {
  vacancies?: IVacancy[]
}




export default function RecruitingEmployee(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const isLightTheme = appContext.theme === AppTheme.Light
  const [popularCourses, setPopularCourses] = useState<Map<number, ICourse>>(new Map)
  const [news, setNews] = useState<Map<number, IArticle>>(new Map)
  const {t} = useTranslation()



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
      return new Map(state)
    })
    setNews(state => {
      news.data.forEach(el => {
        state.set(el.id, el)
      })
      return new Map(state)
    })
  }

  useEffect(()=>{
    init()
  }, [])
  

  return (<div className={styles.root}> 
    <div className={styles.top}>
      {riveAnimation}
      <P styleType={['fs32', 'w600']} useThemeColor className={styles.title}>
        {t('landing_em_findWork')}
        <span className={styles.title_big}> {t('landing_in')} <span className={styles.title_purple}>Arbi</span>Hunter</span>
      </P>
      <Link className={styles.createLink} href={'/create/cv'} ><span>{t('landing_em_createCV')}</span></Link>
    </div>

    <Search title={t('search_vacancy')} tags={['Media Buyer', 'Affiliate Manger', 'Sales Manager', 'Team Lead']}/>
    
    <Title 
    title={t('landing_em_findCategories')}
    className={styles.title} 
    itemClassName={styles.titleLink} 
    onAllWatchClick={()=>{}}/>
    <Categories 
    count={t('landing_em_vcCounter')}
    image={isLightTheme? recruitingCatCompaniesLight:recruitingCatCompanies} 
    titles={['CPA-сети', 'Маркетинг', 'Media Buying']} 
    images={isLightTheme?[s3Light, s1Light, s2Light]:[s3, s1, s2]}/>
    {!isTabletWidth &&
      <Button  styleType={['grey']} altStyleType={['white', 'borderGrey']} className={styles.watchAll}>{t('watchAll')}</Button>
    }

    <Possibilities/>

    <Title 
    title={t('landing_em_articles')} 
    className={styles.title} 
    itemClassName={styles.titleLink} 
    onAllWatchClick={()=>{}}/>
    {news.size > 0 &&
      <ArticlesList news={[...news.values()]}/>
    }
    {!isTabletWidth &&
      <Button  styleType={['grey']} altStyleType={['white', 'borderGrey']} className={styles.watchAll}>{t('watchAll')}</Button>
    }

    <Title 
    title={t('landing_em_freeCourses')} 
    className={styles.title} 
    itemClassName={styles.titleLink} 
    onAllWatchClick={()=>{}}/>
    {popularCourses.size > 0 &&
      <CoursesList courses={[...popularCourses.values()]}/>
    }

    {!isTabletWidth &&
      <Button styleType={['grey']} altStyleType={['white', 'borderGrey']} className={styles.watchAll}>{t('watchAll')}</Button>
    }
    
    <AppPromo cards={[slide3, slide4, slide5]}/>

    <Help/>
  </div>)
}