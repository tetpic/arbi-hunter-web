import styles from './index.module.scss'

import Link from 'next/link'
import Title from 'components/ui/TitleForSection'
import Button from 'components/ui/Button'
import AppPromo from '../sections/AppPromo'
import Help from '../sections/Help'
import Search from '../sections/Search'
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
import Reasons from '../RecruitingHirer/Reasons'
import FindEmployees from '../RecruitingHirer/FindEmployees'
import { ProfileType } from 'data/interfaces/IRegistration'
import { runtimeConfig } from 'config/runtimeConfig'
import classNames from 'classnames'
import { useRouter } from 'next/router'



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
  const router = useRouter()
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
      CoursesRepository.getCourses({page: 1, limit: 20, categories: [runtimeConfig.FREE_COURSES_ID]},Languages.ru),
      ArticlesRepository.getNews({page: 1, limit: 20, isTop: true}),
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
    onAllWatchClick={()=>{router.push('/registration')}}/>
    <Categories 
    count={t('landing_em_vcCounter')}
    imagesExamples={['/images/companyLogos/planetCompany1.png', '/images/companyLogos/planetCompany2.jpg', '/images/companyLogos/planetCompany3.png', '/images/companyLogos/planetCompany4.png', '/images/companyLogos/planetCompany5.jpg']} 
    titles={[t('cpaWires'), t('marketing'), 'Media Buying']} 
    images={isLightTheme?[s3Light, s1Light, s2Light]:[s3, s1, s2]}/>
    {!isTabletWidth &&
      <Button onClick={()=>{router.push('/registration')}}  styleType={['grey', 'whiteText']} altStyleType={['white', 'borderGrey']} className={styles.watchAll}>{t('watchAll')}</Button>
    }

    <Reasons profileType={ProfileType.Employee}/>

    <Title className={classNames(styles.title, styles.mobileCentered)}  title={t('landing_em_startSearching')}/>
    <FindEmployees profileType={ProfileType.Employee} />

    {/* <Possibilities/> */}

    <Title 
    title={t('landing_em_articles')} 
    className={styles.title} 
    itemClassName={styles.titleLink} 
    onAllWatchClick={()=>{router.push('/registration')}}/>
    {news.size > 0 &&
      <ArticlesList news={[...news.values()]} onlyTitles/>
    }
    {!isTabletWidth &&
      <Button onClick={()=>{router.push('/registration')}}  styleType={['grey', 'whiteText']} altStyleType={['white', 'borderGrey']} className={styles.watchAll}>{t('watchAll')}</Button>
    }

    <Title 
    title={t('landing_em_freeCourses')} 
    className={styles.title} 
    itemClassName={styles.titleLink} 
    onAllWatchClick={()=>{router.push('/registration')}}/>
    {popularCourses.size > 0 &&
      <CoursesList courses={[...popularCourses.values()]} disableLink/>
    }

    {!isTabletWidth &&
      <Button onClick={()=>{router.push('/registration')}} styleType={['grey', 'whiteText']} altStyleType={['white', 'borderGrey']} className={styles.watchAll}>{t('watchAll')}</Button>
    }
    
    <AppPromo cards={[slide3, slide4, slide5]}/>

    <Help/>
  </div>)
}