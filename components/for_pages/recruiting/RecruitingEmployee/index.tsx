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
import recruitingCatCompanies from 'images/recruiting/recruitingCatCompanies.png'
import Rive from '@rive-app/react-canvas'
import {  useMemo } from 'react'
import slide3 from 'images/recruiting/recruiting_swipe3.png'
import slide4 from 'images/recruiting/recruiting_swipe4.png'
import slide5 from 'images/recruiting/recruiting_swipe5.png'
import { useAppContext } from 'context/state'
import SearchBar from 'components/ui/SearchBar'
import dynamic from 'next/dynamic'
import { IVacancy } from 'data/interfaces/IVacancy'

const Categories = dynamic(() => import('../sections/Categories'), {
  ssr: false
})

interface Props {
  vacancies?: IVacancy[]
}




export default function RecruitingEmployee(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  const riveAnimation = useMemo(()=>{
    return <Rive 
    src={'/rive/cv_laptop.riv'} 
    animations={[   
      'Money3',
      'Money2',
      'Money1',
      'MoneyLoop',
      'Laptop',
      'HandR',
      'HandL',
      'Head',
      'Eyes',
      'Boot',]} 
    className={styles.image}/>
  }, [])
  

  return (<div className={styles.root}> 
    {isTabletWidth && <SearchBar placeholder='Поиск вакансий'/>}
    <div className={styles.top}>
      {riveAnimation}
      <h2 className={styles.title}>
        Найдите работу мечты 
        <span className={styles.title_big}> в <span className={styles.title_purple}>Arbi</span>Hunter</span>
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

    {!isTabletWidth && <Search title={'Поиск вакансий'}/>}
    
    <Title title="Поиск по популярным категориям" className={styles.title}/>
    <Categories count='вакансий' image={recruitingCatCompanies} titles={['Вакансии дня', 'Для программистов', 'Для дизайнеров']}/>
    {!isTabletWidth &&
      <Button className={styles.watchAll}>Смотреть все</Button>
    }

    <Possibilities/>
    {props.vacancies.length > 0 &&  
    <>
      <Title title={'Вакансии дня'} className={styles.title}/>
      <Vacancies vacancies={props.vacancies}/>
    </>
    }
    {!isTabletWidth &&
      <Button className={styles.watchAll}>Смотреть все</Button>
    }

    <AppPromo cards={[slide3, slide4, slide5]}/>

    <Help/>
  </div>)
}