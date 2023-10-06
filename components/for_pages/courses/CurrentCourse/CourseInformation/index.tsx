import classNames from 'classnames'
import ICourse from 'data/interfaces/ICourse'
import languages from '@cospired/i18n-iso-languages'
import UserPic from 'components/ui/UserPic'
import ReactPlayer from 'react-player'
import { useEffect, useState } from 'react'
import { FILES } from 'types/constants'
import Button from 'components/ui/Button'
import GlobusSvg from 'components/svg/GlobusSvg'
import TimerSvg from 'components/svg/TimerSvg'
import EducationSvg from 'components/svg/EducationSvg'
import styles from './index.module.scss'

interface Props {
  course: ICourse
  isMobile?: boolean
}

export default function CoursesInformation({course, isMobile}: Props) {

  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(()=>{
    setLoaded(true)
  }, [])
  

  languages.registerLocale(require(`@cospired/i18n-iso-languages/langs/${course.language}.json`))
  const courseLang = languages.getName(course.language, course.language)
  const filePath = FILES

  return (<div className={styles.root}> 
    <div className={styles.item}>
      {!isMobile &&
        <p className={styles.title}>Описание</p>
      }
      <p className={styles.text}>{course.fullDescription}</p>
    </div>

    <div className={classNames(styles.item, styles.stats)}>
      <div className={styles.stat}>
        <Button className={styles.button}><GlobusSvg/></Button>
        <p className={styles.stat_title}>Язык</p>
        <p className={styles.stat_value}>{courseLang&&(courseLang.charAt(0).toUpperCase() + courseLang.slice(1))}</p>
      </div>
      <div className={styles.stat}>
        <Button className={styles.button}><TimerSvg/></Button>
        <p className={styles.stat_title}>Время</p>
        <p className={styles.stat_value}>{course.courseTime}</p>
      </div>
      <div className={styles.stat}>
      <Button className={styles.button}><EducationSvg/></Button>
        <p className={styles.stat_title}>Сертификат</p>
        <p className={styles.stat_value}>{course.withCertificate?'Выдается': 'Не выдаётся'}</p>
      </div>
    </div>

    {course.video && loaded &&
      <div className={styles.item}>
        <div className={styles.videoWrapper}>
          <ReactPlayer width={'100%'} height={'auto'} url={filePath + course.video.source} controls/>
        </div>
      </div>
    }

    <div className={classNames(styles.item, styles.author)}>
        <p className={styles.title}>Об {course.authors.length>1?'авторах':'авторе'}</p>
        {course.authors.length>0&&
        course.authors.map((el, index)=> {
          return <div key={index} className={styles.author_wrapper}>
            <UserPic className={styles.author_image} image={filePath+el.image.source} size={75}/>
            <p className={styles.author_name}>{el.name}</p>
            <p className={styles.author_description}>{el.description}</p>
          </div>
        })
        }
      </div>

    <div className={styles.item}>
      <p className={styles.title}>Требования</p>
      <p className={styles.text}>{course.requirements}</p>
    </div>

    <div className={styles.item}>
      <p className={styles.title}>Целевая аудитория</p>
      <p className={styles.text}>{course.audience}</p>
    </div>

  </div>)
}
