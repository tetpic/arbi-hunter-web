import { useUserContext } from 'context/user_state'
import styles from './index.module.scss'
import Title from '@/components/ui/TitleForSection'
import shopImage from 'images/shop/shopBucket.png'
import Image from 'next/image'
import P from '@/components/ui/P'
import Formatter from 'utils/formatter'
import ArbiCoinGradientSvg from '@/components/svg/ArbiCoinGradientSvg'
import Button from '@/components/ui/Button'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

export default function ShopBalance(props: Props) {
  const {t} = useTranslation()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  const openRefillModal = () => {
    isTabletWidth?
    appContext.showBottomSheet(ModalType.RefillBalanceModal, undefined, 350)
    :
    appContext.showModal(ModalType.RefillBalanceModal)
  }

  return (<div className={styles.root}> 
  
  <div className={styles.imageWrapper}>
    <Image src={shopImage} alt={'balance bucket'}  width={200} height={200}/>
  </div>

  <Title title={t('shop_profileBalance')} className={styles.title}/>

  <div className={styles.balance}>
    <ArbiCoinGradientSvg/>
    <P  styleType={['w600', 'huge']}>{Formatter.formatPrice(userContext.user?.balance)||0}</P>
  </div>

  <Button className={styles.button} styleType={['gradient', 'wide']} onClick={openRefillModal}>{t('shop_fill')}</Button>
  </div>)
}