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
import usersLight from 'images/recruiting/usersLight.png'
import slide1 from 'images/recruiting/recruiting_swipe1.png'
import slide2 from 'images/recruiting/recruiting_swipe2.png'
import { ICV } from 'data/interfaces/ICV'
import { useAppContext } from 'context/state'
import recruitingCatWallet from 'images/recruiting/scene1.png'
import recruitingCatWalletLight from 'images/recruiting/scene1Light.png'
import recruitingCatPoint from 'images/recruiting/scene3.png'
import recruitingCatPointLight from 'images/recruiting/scene3Light.png'
import recruitingCatMessage from 'images/recruiting/scene2.png'
import recruitingCatMessageLight from 'images/recruiting/scene2Light.png'
import { AppTheme } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'



interface Props {
  cvs?: ICV[]
}

export default function RecruitingHirer(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light
  const {isTabletWidth} = appContext.size

  return (
    <div className={styles.root}> 
      <Head/>
      <Search 
      title={t('landing_hir_findVc')} 
      tags={['Media Buyer', 'Affiliate Manger', 'Frontented-Разработчик', 'SMM-менеджер']}
      />
      <Reasons/>
    
      <Title className={styles.title} title={t('landing_hir_startSearching')}/>
      <FindEmployees/>
      
      <AppPromo cards={[slide1, slide2]}/>
    
      <Title className={styles.title} title={t('landing_hir_searchCategories')}/>
      <Categories 
      count={t('landing_hir_cvCounter')} 
      image={isLightTheme?usersLight:users} 
      titles={['Маркетинг', 'Разработка', 'Менеджмент']} 
      images={isLightTheme?[recruitingCatWalletLight, recruitingCatPointLight, recruitingCatMessageLight]:[recruitingCatWallet, recruitingCatPoint, recruitingCatMessage]}
      />
      <Button 
      styleType={['grey']} 
      altStyleType={['white', 'borderGrey']} 
      className={styles.watchAll}>
        {t('watchAll')}
      </Button>
      <Help/>
    </div>
  )
}