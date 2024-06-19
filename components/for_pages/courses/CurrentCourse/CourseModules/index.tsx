import styles from './index.module.scss'

import classNames from 'classnames'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import PlayTransparentSvg from 'components/svg/PlayTransparentSvg'
import Accordeon from 'components/ui/Accordeon'
import Spinner from 'components/ui/Spinner'
import { useCoursesContext } from 'context/courses_state'
import ICourse, { ICourseBlock } from 'data/interfaces/ICourse'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { colors } from 'styles/variables'
import Formatter from 'utils/formatter'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import P from '@/components/ui/P'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  course: ICourse
  modules: ICourseBlock[]
}

export default function CourseModules({course}: Props) {
  const {t} = useTranslation()
  const {courseModules, setCourseModules} = useCoursesContext()
  const [loadingBlocks, setLoadingBlocks] = useState<boolean>(true)
  const [activeModule, setActiveModule] = useState<ICourseBlock>(null)
  const router = useRouter()


  const onTitleClick = (c: ICourseBlock) => {
    setActiveModule(state=> state===c?null:c)
  }
  

  return (<div className={styles.root}> 
    {courseModules.size > 0 &&
      [...courseModules.entries()].map(([k, v], blockIndex)=> (
        <div className={styles.item} key={k.id}>
          <div className={styles.top} onClick={() => onTitleClick(k)}>
            <div className={styles.imageWrapper}>
              {k.image?.source &&
                <Image 
                unoptimized
                className={styles.image} 
                src={ImageHelper.urlFromFile(k.image, Preset.smallIconResize)}
                width={65} 
                height={48} 
                alt={'course title'}/>
              }
              <div className={styles.progressBarWrapper}>
                <CircularProgressbar styles={buildStyles({textColor: colors.white, trailColor: colors.greyAlt, pathColor: colors.blue})} value={k.progress} text={`${k.progress}%`}/>
              </div>
            </div>
            <p className={styles.title}>{k.title}</p>
            <p className={styles.counter}>{v?.length||k.stepsCount} {Formatter.pluralize(Number(v?.length||k.stepsCount), t('lesson1'), t('lesson2'), t('lesson3'))}</p>
            <ArrowDownSvg className={classNames(styles.arrow, activeModule === k&&styles.arrow_active)}/>
          </div>
          <Accordeon isActive={activeModule === k}>
            <>
            {v.length > 0 && 
              v.map((el, index) => {
                return (
                  <div className={classNames(styles.step)} key={el.id}>
                      <p 
                      className={styles.stepTitle} 
                      onClick={()=> router.push(`/courses/${course.id}/modules?module=${blockIndex+1}&block=${index+1}&step=1`)}>
                        {index + 1}. {el.title} {/*el.progress === 100?*/ /*<CheckSvg className={styles.checkSvg}/>*/ <PlayTransparentSvg className={styles.playSvg}/>}
                      </p>
                      <div className={styles.stepBody} dangerouslySetInnerHTML={{__html: el.body}}></div>
                  </div>
                )
              })
            }
          </>
          </Accordeon>
        </div>
      ))
      ||
      loadingBlocks && <Spinner size={32} color={colors.blue}/>
      ||
      <P useThemeColor  className={'empty'}>{t('courses_modulesNotFound')}</P>
    }
  </div>)
}