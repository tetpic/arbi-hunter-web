import styles from './index.module.scss'

import HeartSvg from 'components/svg/HeartSvg'
import UserPic from 'components/ui/UserPic'
import beats from 'images/recruiting/recruiting_mock_company.png' //55*55
import Button from 'components/ui/Button'


interface Props {
}

export default function Vacancies(props: Props) {

  return (<section className={styles.vacancies}>
    <div className={styles.vacancy}>
      <div className={styles.top}>
        <UserPic className={styles.pic} image={beats} size={42}/>
        <p className={styles.title}>Apple Company</p>
        <p className={styles.city}>г. Санкт-Петербург</p>
        <Button className={styles.heartButton} styleType='filledGrey'><HeartSvg/></Button>
      </div>
      <p className={styles.name}>Маркетолог в компанию удаленно на постоянную основу</p>
      <p className={styles.cost}><img src="/icons/money.png" alt="" width={24} height={24}/> от 350 000 ₽</p>
      <div className={styles.bottom}>
        <p className={styles.time}>13 мая в 11:00</p>
        <Button className={styles.button}>Откликнуться</Button>
      </div>
    </div>
    <div className={styles.vacancy}>
      <div className={styles.top}>
        <UserPic className={styles.pic} image={beats} size={42}/>
        <p className={styles.title}>Apple Company</p>
        <p className={styles.city}>г. Санкт-Петербург</p>
        <Button className={styles.heartButton} styleType='filledGrey'><HeartSvg/></Button>
      </div>
      <p className={styles.name}>Маркетолог в компанию удаленно на постоянную основу</p>
      <p className={styles.cost}><img src="/icons/money.png" alt="" width={24} height={24}/> от 350 000 ₽</p>
      <div className={styles.bottom}>
        <p className={styles.time}>13 мая в 11:00</p>
        <Button className={styles.button}>Откликнуться</Button>
      </div>
    </div>
    <div className={styles.vacancy}>
      <div className={styles.top}>
        <UserPic className={styles.pic} image={beats} size={42}/>
        <p className={styles.title}>Apple Company</p>
        <p className={styles.city}>г. Санкт-Петербург</p>
        <Button className={styles.heartButton} styleType='filledGrey'><HeartSvg/></Button>
      </div>
      <p className={styles.name}>Маркетолог в компанию удаленно на постоянную основу</p>
      <p className={styles.cost}><img src="/icons/money.png" alt="" width={24} height={24}/> от 350 000 ₽</p>
      <div className={styles.bottom}>
        <p className={styles.time}>13 мая в 11:00</p>
        <Button className={styles.button}>Откликнуться</Button>
      </div>
    </div>


  </section>)
}