import P from '@/components/ui/P'
import styles from './index.module.scss'
import SwiperList from '@/components/ui/SwiperList'
import ICourse from 'data/interfaces/ICourse'
import Image from 'next/image'
import { useEffect } from 'react'

import PlayButtonSvg from '@/components/svg/PlayButtonSvg'
import Formatter from 'utils/formatter'
import UserSmallSvg from '@/components/svg/UserSmallGreySvg'
import StarSmallFilledSvg from '@/components/svg/StarSmallFilledSvg'
import classNames from 'classnames'
import { useAppContext } from 'context/state'
import { AppTheme, Preset } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import ImageHelper from 'utils/ImageHelper'
// import { useEffect } from 'react'

interface Props {
  courses: ICourse[]
  disableLink?: boolean
}

export default function CoursesList(props: Props) {
  const {t} = useTranslation()
  const router = useRouter()
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light
  const {isTabletWidth} = appContext.size

  const arrayPackager = <T,>(arr: T[], packBy: number): T[][] => {
    let newArr:T[][] = []
    const arrLength: number = arr.length
    const length: number = arrLength / packBy

    for(let i = 0; i < length; i++) {
      if(i === 0) {
        newArr.push(arr.slice(0, packBy))
      }
      else {
        newArr.push(arr.slice(i*packBy, (i+1)*packBy))
      }
    }
    return newArr as T[][]
  }

  useEffect(()=>{
    arrayPackager(props.courses, 2)
  }, [])


  return (
    <SwiperList 
    hideNav 
    swiperProps={{loop: false, spaceBetween: isTabletWidth?8:16}} 
    slideClassName={styles.slide} 
    swiperClassname={styles.swiper}
    >
      {arrayPackager(props.courses, 2).map((el)=>{
        return (
          <div className={styles.itemPack}>
            {el.map((course)=>{
              return (
                <div 
                className={classNames(styles.item, isLightTheme&&styles.item_light)} 
                onClick={()=> !props.disableLink&&router.push('/courses/' + course.id)} 
                key={course.id}
                >
                  <Image 
                  unoptimized 
                  src={ImageHelper.urlFromFile(course.image, Preset.xsCrop)} 
                  alt={'course image'} 
                  width={185} 
                  height={185} 
                  className={styles.image}/>
                  <div className={styles.content}>
                    <P 
                    styleType={['small', 'w500']} 
                    useThemeColor 
                    className={classNames(styles.textLine, styles.counter) }>
                      <PlayButtonSvg/> {course.stepsCount} {Formatter.pluralize(Number(course.stepsCount),  t('lesson1'), t('lesson2'), t('lesson3'))}
                    </P>
                    <P styleType={['large', 'w600']} useThemeColor className={styles.title}>{course.name}</P>
                    <P styleType={['blue', 'large', 'w600']}>{t('free')}</P>
                    
                    <div className={styles.bottom}>
                      {course.completedCount > 0 &&
                        <P 
                        styleType={['medium', 'w500', 'greyLight']} 
                        className={classNames(styles.textLine, styles.counter)}>
                          <UserSmallSvg/> {course.completedCount} {Formatter.pluralize(Number(course.completedCount), t('student1'), t('student2'), t('student3'))}
                        </P>
                      }
                      {course.rating &&
                        <P styleType={['medium', 'w500', 'greyLight']} className={styles.textLine}><StarSmallFilledSvg/> {course.rating} из 5</P>
                      }
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </SwiperList>
  )
    // <SwiperList>


    // </SwiperList>
}