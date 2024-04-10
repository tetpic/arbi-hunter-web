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
import userExample1 from 'images/recruiting/userExample1.png'
import userExample2 from 'images/recruiting/userExample2.png'
import userExample3 from 'images/recruiting/userExample3.png'
import userExample4 from 'images/recruiting/userExample4.webp'
import userExample5 from 'images/recruiting/userExample5.webp'
import userExample6 from 'images/recruiting/userExample6.webp'

import slide1 from 'images/recruiting/recCard1.jpg'
import slide2 from 'images/recruiting/recCard2.jpg'
import slide3 from 'images/recruiting/recCard3.jpg'
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
import { ProfileType } from 'data/interfaces/IRegistration'



interface Props {
  cvs?: ICV[]
}

export default function RecruitingHirer(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light

  return (
    <div className={styles.root}> 
      <Head/>
      <Search 
      title={t('landing_hir_findVc')} 
      tags={['Media Buyer', 'Affiliate Manger', 'Frontented-Разработчик', 'SMM-менеджер']}
      />
      <Reasons profileType={ProfileType.Hirer}/>
    
      <Title className={styles.title} title={t('landing_hir_startSearching')}/>
      <FindEmployees profileType={ProfileType.Hirer}/>
      
      <AppPromo cards={[slide1, slide2, slide3]}/>
    
      <Title className={styles.title} title={t('landing_hir_searchCategories')}/>
      <Categories 
      count={t('landing_hir_cvCounter')} 
      imagesExamples={[userExample1, userExample2, userExample3, userExample4, userExample5, userExample6]} 
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