import styles from './index.module.scss'

import SearchBar from 'components/ui/SearchBar'
import Link from 'next/link'
import recEmpImage from 'images/recruiting/recruiting_employee_page.png'
import Image from 'next/image'

interface Props {
}

export default function RecruitingPageEmployee(props: Props) {

  return (<div className={styles.root}> 
  <p style={{color: 'white'}}>RECRUITING PAGE HIRER /в разработке/</p>
 
  <div className={styles.top}>
    <div className={styles.back}>
      <Image className={styles.image} src={recEmpImage} alt={'rec image'} width={814} height={249}/>
    </div>
    <p className={styles.title}>Найти работу в ArbiHunter</p>
    <p className={styles.description}>
      Ежедневно более 1000 людей находят работу в&nbsp;ArbiHunter <br/> которая позволяет им&nbsp;расти и&nbsp;становиться успешными!    
    </p>
    <Link className={styles.createLink} href={'/create/cv'}>Создать резюме</Link>
  </div>
  <SearchBar fullWidth className={styles.searchBar}/>
  </div>)
}