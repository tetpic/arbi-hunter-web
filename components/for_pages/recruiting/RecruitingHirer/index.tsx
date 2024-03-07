import styles from './index.module.scss'

import Button from 'components/ui/Button'
import Search from '../sections/Search'
import AppPromo from '../sections/AppPromo'
import Help from '../sections/Help'
import Categories from '../sections/Categories'
import Title from 'components/ui/TitleForSection'
import FindEmployees from './FindEmployees'
import Reasons from './Reasons'
import Head from './Head'
import users from 'images/recruiting/users.png'
import slide1 from 'images/recruiting/recruiting_swipe1.png'
import slide2 from 'images/recruiting/recruiting_swipe2.png'
import { ICV } from 'data/interfaces/ICV'
import { useAppContext } from 'context/state'
import SearchBar from 'components/ui/SearchBar'
import recruitingCatWallet from 'images/recruiting/scene1.png'
import recruitingCatPoint from 'images/recruiting/scene2.png'
import recruitingCatMessage from 'images/recruiting/scene3.png'



interface Props {
  cvs?: ICV[]
}

export default function RecruitingHirer(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  return (
    <div className={styles.root}> 
    {isTabletWidth && <SearchBar placeholder='Поиск вакансий'/>}
      <Head/>

      {!isTabletWidth && <Search title={'Поиск резюме'} tags={['Media Buyer', 'Affiliate Manger', 'Frontented-Разработчик', 'SMM-менеджер']}/>}
      
      <Reasons/>
    
      <Title className={styles.title} title={'Начни поиск в три шага'}/>
      <FindEmployees/>
      
      <AppPromo cards={[slide1, slide2]}/>
    
      <Title className={styles.title} title={'Поиск по популярным категориям'}/>
      <Categories count='резюме' image={users} titles={['Маркетинг', 'Разработка', 'Менеджмент']} images={[recruitingCatWallet, recruitingCatPoint, recruitingCatMessage]}/>
      <Button className={styles.watchAll}>Смотреть все</Button>
    
      <Help/>
    </div>
  )
}