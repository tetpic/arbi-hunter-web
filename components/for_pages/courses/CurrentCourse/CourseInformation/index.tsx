import styles from './index.module.scss'

import classNames from 'classnames'
import ICourse from 'data/interfaces/ICourse'
import languages from '@cospired/i18n-iso-languages'
import UserPic from 'components/ui/UserPic'
import ReactPlayer from 'react-player'
import { useEffect, useState } from 'react'
import Button from 'components/ui/Button'
import GlobusSvg from 'components/svg/GlobusSvg'
import TimerSvg from 'components/svg/TimerSvg'
import EducationSvg from 'components/svg/EducationSvg'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import { useAppContext } from 'context/state'

interface Props {
  course: ICourse
  isMobile?: boolean
}

export default function CoursesInformation({course, isMobile}: Props) {
  const appContext = useAppContext()
  const theme = appContext.theme
  const {t} = useTranslation()
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(()=>{
    setLoaded(true)
  }, [])

  languages.registerLocale(require(`@cospired/i18n-iso-languages/langs/${course.language}.json`))
  const courseLang = languages.getName(course.language, course.language)

  return (<div className={styles.root}> 
    <div className={styles.item}>
      {!isMobile &&
        <P styleType={['large', 'w600']} useThemeColor className={styles.title}>{t('courses_description')}</P>
      }
      <P styleType={['w500']} useThemeColor className={styles.text}>{course.fullDescription}</P>
    </div>

    <div className={classNames(styles.item, styles.stats)}>
      <div className={styles.stat}>
        <Button className={styles.button}><GlobusSvg /></Button>
        <P styleType={['large', 'w600']} useThemeColor className={styles.stat_title}>{t('courses_lang')}</P>
        <P styleType={['w500', 'medium']} useThemeColor className={styles.stat_value}>{courseLang&&(courseLang.charAt(0).toUpperCase() + courseLang.slice(1))}</P>
      </div>
      <div className={styles.stat}>
        <Button className={styles.button}><TimerSvg/></Button>
        <P styleType={['large', 'w600']} useThemeColor className={styles.stat_title}>{t('courses_time')}</P>
        <P styleType={['w500', 'medium']} useThemeColor className={styles.stat_value}>{course.courseTime}</P>
      </div>
      <div className={styles.stat}>
      <Button className={styles.button}><EducationSvg/></Button>
        <P styleType={['large', 'w600']} useThemeColor className={styles.stat_title}>{t('courses_certificate')}</P>
        <P styleType={['w500', 'medium']} useThemeColor className={styles.stat_value}>{course.withCertificate?t('courses_certificateIssues'): t('courses_certificateNotIssued')}</P>
      </div>
    </div>

    {course.video && loaded &&
      <div className={styles.item}>
        <div className={styles.videoWrapper}>
          <ReactPlayer width={'100%'} height={'auto'} url={ImageHelper.urlFromSource(course.video.source)} controls/>
        </div>
      </div>
    }

    <div className={classNames(styles.item, styles.author)}>
        <P styleType={['large', 'w600']} useThemeColor className={styles.title}>{t('courses_about')} {course.authors.length>1?t('courses_author'):t('courses_authors')}</P>
        {course.authors.length>0&&
        course.authors.map((el, index)=> {
          return <div key={index} className={styles.author_wrapper}>
            <UserPic 
            className={styles.author_image} 
            image={ImageHelper.urlFromFile(el.image, Preset.iconCrop)} 
            size={75}/>
            <p className={styles.author_name}>{el.name}</p>
            <p className={styles.author_description}>{el.description}</p>
          </div>
        })
        }
      </div>

    <div className={styles.item}>
      <P styleType={['large', 'w600']} useThemeColor className={styles.title}>{t('courses_requirements')}</P>
      <P styleType={['w500']} useThemeColor className={styles.text}>{course.requirements}</P>
    </div>

    <div className={styles.item}>
      <P styleType={['large', 'w600']} useThemeColor className={styles.title}>{t('courses_audience')}</P>
      <P styleType={['w500']} useThemeColor className={styles.text}>{course.audience}</P>
    </div>

  </div>)
}
