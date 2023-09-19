import classNames from 'classnames'
import ICourse from 'data/interfaces/ICourse'
import languages from '@cospired/i18n-iso-languages'
import styles from './index.module.scss'
import UserPic from 'components/ui/UserPic'

interface Props {
  course: ICourse
}

export default function CoursesInformation({course}: Props) {

  languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
  const courseLang = languages.getName(course.language, course.language)
  const filePath = process.env.files

  return (<div className={styles.root}> 
    <div className={styles.item}>
      <p className={styles.title}>Описание</p>
      <p className={styles.text}>{course.fullDescription}</p>
    </div>

    <div className={classNames(styles.item, styles.stats)}>
      <div className={styles.stat}>
        <p className={styles.stat_title}>Язык</p>
        <p className={styles.stat_value}>{courseLang.charAt(0).toUpperCase() + courseLang.slice(1)}</p>
      </div>
      <div className={styles.stat}>
        <p className={styles.stat_title}>Время</p>
        <p className={styles.stat_value}>{course.courseTime}</p>
      </div>
      <div className={styles.stat}>
        <p className={styles.stat_title}>Сертификат</p>
        <p className={styles.stat_value}>{course.withCertificate?'Выдается': 'Не выдаётся'}</p>
      </div>
    </div>

    {course.video && 
      <div className={styles.item}>
        <video className={styles.video} src={filePath + course.video.source}/>
      </div>
    }

    <div className={classNames(styles.item, styles.author)}>
        <p className={styles.title}>Об {course.authors.length>1?'авторах':'авторе'}</p>
        {course.authors.length>0&&
        course.authors.map(el=> {
          return <div className={styles.author_wrapper}>
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