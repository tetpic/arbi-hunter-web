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
import styles from './index.module.scss'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  course: ICourse
  isMobile?: boolean
}

export default function CoursesInformation({course, isMobile}: Props) {
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
        <p className={styles.title}>{t('courses_description')}</p>
      }
      <p className={styles.text}>{course.fullDescription}</p>
    </div>

    <div className={classNames(styles.item, styles.stats)}>
      <div className={styles.stat}>
        <Button className={styles.button}><GlobusSvg/></Button>
        <p className={styles.stat_title}>{t('courses_lang')}</p>
        <p className={styles.stat_value}>{courseLang&&(courseLang.charAt(0).toUpperCase() + courseLang.slice(1))}</p>
      </div>
      <div className={styles.stat}>
        <Button className={styles.button}><TimerSvg/></Button>
        <p className={styles.stat_title}>{t('courses_time')}</p>
        <p className={styles.stat_value}>{course.courseTime}</p>
      </div>
      <div className={styles.stat}>
      <Button className={styles.button}><EducationSvg/></Button>
        <p className={styles.stat_title}>{t('courses_certificate')}</p>
        <p className={styles.stat_value}>{course.withCertificate?t('courses_certificateIssues'): t('courses_certificateNotIssued')}</p>
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
        <p className={styles.title}>{t('courses_about')} {course.authors.length>1?t('courses_author'):t('courses_authors')}</p>
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
      <p className={styles.title}>{t('courses_requirements')}</p>
      <p className={styles.text}>{course.requirements}</p>
    </div>

    <div className={styles.item}>
      <p className={styles.title}>{t('courses_audience')}</p>
      <p className={styles.text}>{course.audience}</p>
    </div>

  </div>)
}
