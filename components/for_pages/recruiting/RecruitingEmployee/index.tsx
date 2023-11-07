import styles from './index.module.scss'

import Image from 'next/image'
import recriuitingTopImageEmp from 'images/recruiting/recriuitingTopImageEmp.png'
import usersTopEmployee from 'images/recruiting/usersTopEmployee.png'
import recruitingCatWallet from 'images/recruiting/recruitingCatWallet.png'
import recruitingCatPoint from 'images/recruiting/recruitingCatPoint.png'
import recruitingCatMessage from 'images/recruiting/recruitingCatMessage.png'
import recruitingCatCompanies from 'images/recruiting/recruitingCatCompanies.png'
import Link from 'next/link'
import Title from 'components/ui/TitleForSection'
import SearchBar from 'components/ui/SearchBar'
import Button from 'components/ui/Button'
import Possibilities from './Possibilities'

interface Props {
}

export default function RecruitingEmployee(props: Props) {

  return (<div className={styles.root}> 
  <div className={styles.top}>
    <Image className={styles.image} src={recriuitingTopImageEmp} alt={''} width={600} height={460}/>
    <h2 className={styles.title}>
      Найдите работу мечты 
      <span className={styles.title_big}>в <span className={styles.title_purple}>Arbi</span>Hunter</span>
    </h2>
    <p className={styles.description}>
      Ежедневно более 1000 людей находят работу в ArbiHunter которая позволяет им расти и становиться успешными!
    </p>
    <div className={styles.found}>
      <Image src={usersTopEmployee} alt={''}/>
      <p>
        <span className={styles.found_bold}>+25 500</span> <br/> уже нашли
      </p>
    </div>

    <Link className={styles.createLink} href={'/create/cv'} ><span>Создать резюме</span></Link>
  </div>

  <div className={styles.search}>
    <Title title='Поиск вакансий' className={styles.smallTitle}/>
    <div className={styles.tags}>
      <p className={styles.tag}>Разработка</p>
      <p className={styles.tag}>Маркетинг</p>
      <p className={styles.tag}>Разработка</p>
      <p className={styles.tag}>SMM</p>
    </div>
    <SearchBar/>
  </div>

  <Title title="Поиск по популярным категориям" className={styles.title}/>

  <div className={styles.categories}>
    <div className={styles.item}>
      <p className={styles.item__title}>Вакансия дня</p>
      <Image className={styles.item__image} src={recruitingCatWallet} alt='' width={150} height={128}/>
      <div className={styles.item__bottom}>
        <Image src={recruitingCatCompanies} alt={''} width={122} height={55}/>
        <p>+423 вакансий</p>
      </div>
    </div>
    <div className={styles.item}>
      <p className={styles.item__title}>Для программистов</p>
      <Image className={styles.item__image} src={recruitingCatPoint} alt='' width={150} height={128}/>
      <div className={styles.item__bottom}>
        <Image src={recruitingCatCompanies} alt={''} width={122} height={55}/>
        <p>+423 вакансий</p>
      </div>
    </div>
    <div className={styles.item}>
      <p className={styles.item__title}>Для дизайнеров</p>
      <Image className={styles.item__image} src={recruitingCatMessage} alt='' width={150} height={128}/>
      <div className={styles.item__bottom}>
        <Image src={recruitingCatCompanies} alt={''} width={122} height={55}/>
        <p>+423 вакансий</p>
      </div>
    </div>
  </div>
  <Button className={styles.watchAll}>Смотреть все</Button>

  <Possibilities/>
  
  </div>)
}