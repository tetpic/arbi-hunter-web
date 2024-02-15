import P from '@/components/ui/P'
import styles from './index.module.scss'
import SwiperList from '@/components/ui/SwiperList'
import ICourse from 'data/interfaces/ICourse'
import Image from 'next/image'
import { useEffect } from 'react'
import { FILES } from 'types/constants'
import PlayButtonSvg from '@/components/svg/PlayButtonSvg'
import Formatter from 'utils/formatter'
import UserSmallSvg from '@/components/svg/UserSmallGreySvg'
import StarSmallFilledSvg from '@/components/svg/StarSmallFilledSvg'
// import { useEffect } from 'react'

interface Props {
  courses: ICourse[]
}

export default function CoursesList(props: Props) {

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
    <SwiperList hideNav swiperProps={{loop: false, spaceBetween: 16}} slideClassName={styles.slide}>
      {arrayPackager(props.courses, 2).map((el)=>{
        return (
          <div className={styles.itemPack}>
            {el.map((course)=>{
              return (
                <div className={styles.item} key={course.id}>
                  <Image src={FILES + course.image.source} alt={'course image'} width={185} height={185} className={styles.image}/>
                  <div className={styles.content}>
                    <P styleType={['small', 'w500']} className={styles.textLine}><PlayButtonSvg/> {course.stepsCount} {Formatter.pluralize(Number(course.stepsCount), 'урок', 'урока', 'уроков')}</P>
                    <P styleType={['large', 'w600']} className={styles.title}>{course.name}</P>
                    
                    <div className={styles.bottom}>
                      {course.completedCount > 0 &&
                        <P styleType={['medium', 'w500', 'greyLight']} className={styles.textLine}><UserSmallSvg/> {course.completedCount} {Formatter.pluralize(Number(course.completedCount), 'ученик', 'ученика', 'учеников')}</P>
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