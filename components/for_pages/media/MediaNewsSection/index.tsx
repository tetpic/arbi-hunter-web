import classNames from 'classnames'
import styles from './index.module.scss'

interface Props {
    title: string
}

export default function MediaNewsSection(props: Props) {

  return (<section className={styles.root}> 
  <p className={styles.title}>{props.title}</p>
  <div className={styles.content}>
    <div className={styles.mainItem}>
      <div className={styles.tags}>
        <p className={classNames(styles.tag, styles.red)}>Разработка</p>
        <p className={classNames(styles.tag, styles.purple)}>Веб-дизайн</p>
      </div>
      <div className={styles.textWrapper}>
        <p className={styles.itemTitle}>Как получить 57 тысяч переходов в месяц из SEO тысяч переходов</p>
        <p className={styles.itemDesc}>Как получить 57 тысяч переходов в месяц из SEO тысяч переходов</p>
      </div>
      <div className={styles.imageWrapper}></div>
    </div>
    <div className={styles.otherItems}>
      <div className={styles.item}>
          <div className={styles.tags}>
            <p className={classNames(styles.tag, styles.orange)}>Разработка</p>
            <p className={classNames(styles.tag, styles.green)}>Веб-дизайн</p>
          </div>
          <div className={styles.textWrapper}>
            <p className={styles.itemTitle}>Как получить 57 тысяч переходов в месяц из SEO тысяч переходов</p>
            <p className={styles.itemDesc}>Как получить 57 тысяч переходов в месяц из SEO тысяч переходов</p>
          </div>
          <div className={styles.imageWrapper}></div>
      </div>
      <div className={styles.item}>
          <div className={styles.tags}>
            <p className={styles.tag}>Разработка</p>
            <p className={styles.tag}>Веб-дизайн</p>
          </div>
          <div className={styles.textWrapper}>
            <p className={styles.itemTitle}>Как получить 57 тысяч переходов в месяц из SEO тысяч переходов</p>
            <p className={styles.itemDesc}>Как получить 57 тысяч переходов в месяц из SEO тысяч переходов</p>
          </div>
          <div className={styles.imageWrapper}></div>
      </div>
      <div className={styles.item}>
          <div className={styles.tags}>
            <p className={styles.tag}>Разработка</p>
            <p className={styles.tag}>Веб-дизайн</p>
          </div>
          <div className={styles.textWrapper}>
            <p className={styles.itemTitle}>Как получить 57 тысяч переходов в месяц из SEO тысяч переходов</p>
            <p className={styles.itemDesc}>Как получить 57 тысяч переходов в месяц из SEO тысяч переходов</p>
          </div>
          <div className={styles.imageWrapper}></div>
      </div>
     
    </div>
  </div>


  </section>)
}