import styles from './index.module.scss'

import { useEffect } from 'react'
import Buildings from '../../profile/Personal/Buildings'
import { usePersonalContext } from 'context/personal_state'
import { BackgroundCategoryType } from 'data/interfaces/IBackground'
import { ISpecializationCategory } from 'data/interfaces/Common'
import Spinner from '@/components/ui/Spinner'
import Title from '@/components/ui/TitleForSection'
import CategoriesList from '@/components/ui/CategoriesList'
import ArticlesList from '../ArticlesList'
import CoursesList from '../CoursesList'
import CategoryRepository from 'data/repositories/CategoryRepository'
import EyeOpenSmallSvg from '@/components/svg/EyeOpenSmallSvg'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { useAppContext } from 'context/state'
import { useRouter } from 'next/router'
import SwapItemsSvg from '@/components/svg/SwapItemsSvg'
import DocumentSheetSvg from '@/components/svg/DocumentSheetSvg'
import MobileBanners from '../MobileBanners'
import { useVacancyContext } from 'context/vacancy_state'
import { useIndexPageContext } from 'context/index_page_state'



export default function MainPageHirer() {
  const {t} = useTranslation()
  const personalContext = usePersonalContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const router =  useRouter()
  const vacancyContext = useVacancyContext()
  const indexPageContext = useIndexPageContext()

  useEffect(()=>{
    if(!indexPageContext.loaded) {
      indexPageContext.init()
    }
    vacancyContext.setVacancies().then(_ => {
      indexPageContext.setVacancies(vacancyContext.activeVacancies, vacancyContext.archiveVacancies)
    })
  }, [])

  const onCategoryClickHandler = (c: ISpecializationCategory) => {
    CategoryRepository.getSubCategoriesByCategoryId(c.id)
    .then(res => {
      router.push({pathname: '/recruiting', query: {filters: JSON.stringify({categories:res.map(el => el.id)})}})
    })
  }

  return (
    <div className={styles.root}>
      <div className={styles.top}>

        <Buildings 
        useDefaultImage 
        profile={personalContext.currentProfile} 
        background={personalContext.backgrounds?.get(BackgroundCategoryType.Places)}
        />
        
        {indexPageContext.loaded &&
        <div className={styles.statsWeek}>
          <div className={styles.cards}>
            <Link className={styles.card} href={'/responses'}>
              <p className={styles.desc}>{t('mainPage_hir_feedbacks')}</p>
              <SwapItemsSvg className={styles.icon}/>
              {!indexPageContext.stats && <Spinner className={styles.count} size={22}/>
              ||
              <p className={styles.count}>
                { Number(indexPageContext.stats?.responsesCount.responses_count_interval)>0 &&
                  <span>
                    {' + '+ indexPageContext.stats?.responsesCount.responses_count_interval}
                  </span>
                }
              </p>
              }
            </Link>
            <Link className={styles.card} href={'/recruiting'}>
              <p className={styles.desc}>{t('mainPage_hir_cvs')}</p>
              <DocumentSheetSvg className={styles.icon}/>
              {!indexPageContext.stats && <Spinner className={styles.count} size={22}/>
              ||
              <p className={styles.count}>
                { Number(indexPageContext.stats?.viewsCount.views_count_interval)>0 &&
                  <span>
                    {' + '+ indexPageContext.stats?.viewsCount.views_count_interval}
                  </span>
                }
              </p>
              }
            </Link>
            <Link className={styles.card} href={'/views'}>
              <p className={styles.desc}>{t('mainPage_hir_watches')}</p>
              <EyeOpenSmallSvg className={styles.icon}/>
              {!indexPageContext.stats && <Spinner className={styles.count} size={22}/>
              ||
              <p className={styles.count}>
               
                { Number(indexPageContext.stats?.viewsCount.views_count_interval)>0 &&
                  <span>
                    {' + '+ indexPageContext.stats?.viewsCount.views_count_interval}
                  </span>
                }
              </p>
              }
            </Link>
          </div>
        </div>
        }

      </div>


      {isTabletWidth && indexPageContext.loaded && 
        <MobileBanners type={(indexPageContext.activeVacancies.size === 0&&indexPageContext.archiveVacancies.size === 0)?'vacancyCreate':'vipCv'}/>
        ||
        isTabletWidth && <div style={{height: 123, marginTop: 124}}></div>
      }

      {indexPageContext.loaded &&<>

      <Title title={t('mainPage_hir_categories')} className={styles.title} onAllWatchClick={()=>router.push('/recruiting/categories')}/>
      <CategoriesList 
      onClick={onCategoryClickHandler} 
      watchMoreHref={'/recruiting/categories'}  
      link={'/recruiting?categories='} 
      itemClassName={styles.categoryItem}
      categories={[...indexPageContext.categories.values()].filter(e=> e.image)}
      />

      <Title title={t('mainPage_hir_articles')} className={styles.title}/>
      {indexPageContext.news.size > 0 &&
        <ArticlesList onlyTitles news={[...indexPageContext.news.values()]}/>
      }

      <Title title={t('mainPage_hir_freeCourses')} className={styles.title}/>
      {indexPageContext.popularCourses.size > 0 &&
        <CoursesList courses={[...indexPageContext.popularCourses.values()]}/>
      }
      </>}

    </div>
  )
}