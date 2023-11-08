import styles from './index.module.scss'

import Image from 'next/image'
import tower from 'images/recruiting/tower.png'
import resumes from 'images/recruiting/resumes.png'
import Button from 'components/ui/Button'


interface Props {
}

export default function Head(props: Props) {

  return (<section className={styles.head}>
    <Image className={styles.resumes} src={resumes} alt={'resumes'}/>
    <Image className={styles.tower} src={tower} alt={'tower'}/>
    <h6 className={styles.title}>
      Разместите вакансию <br />
      <span className={styles.title_big}>
        в <span className={styles.title_purple}>Arbi</span>Hunter
      </span>
    </h6>
    <p className={styles.desc}>
      46% трудоспособного населения России — <br /> зарегистрированы на ArbiHunter
    </p>
    <Button className={styles.button}>
      <span>
        Разместить вакансию
      </span>
    </Button>
  </section>)
}