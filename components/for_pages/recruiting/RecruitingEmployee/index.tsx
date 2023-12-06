import styles from './index.module.scss'

import Image from 'next/image'
import usersTopEmployee from 'images/recruiting/usersTopEmployee.png'
import Link from 'next/link'
import Title from 'components/ui/TitleForSection'
import Button from 'components/ui/Button'
import Possibilities from './Possibilities'
import Vacancies from './Vacancies'
import AppPromo from '../sections/AppPromo'
import Help from '../sections/Help'
import Search from '../sections/Search'
import Categories from '../sections/Categories'
import recruitingCatCompanies from 'images/recruiting/recruitingCatCompanies.png'
import Rive from '@rive-app/react-canvas'
import { useMemo } from 'react'



export default function RecruitingEmployee() {

  const riveAnimation = useMemo(()=>{
    return <Rive 
    src={'/rive/cv_laptop.riv'} 
    animations={['MoneyLoop','Laptop','HandR','HandL','Head','Eyes','Boot',]} 
    className={styles.image}/>
  }, [])
  

  return (<div className={styles.root}> 
    <div className={styles.top}>
     {riveAnimation}

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

    <Search title={'Поиск вакансий'}/>
    
    <Title title="Поиск по популярным категориям" className={styles.title}/>
    <Categories count='вакансий' image={recruitingCatCompanies} titles={['Вакансии дня', 'Для программистов', 'Для дизайнеров']}/>
    <Button className={styles.watchAll}>Смотреть все</Button>

    <Possibilities/>

    <Title title={'Вакансии дня'} className={styles.title}/>
    <Vacancies/>
    <Button className={styles.watchAll}>Смотреть все</Button>

    <AppPromo/>

    <Help/>
  </div>)
}