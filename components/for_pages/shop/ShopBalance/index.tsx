import { useUserContext } from 'context/user_state'
import styles from './index.module.scss'
import Title from '@/components/ui/TitleForSection'
import shopImage from 'images/shop/shopBucket.png'
import Image from 'next/image'
import P from '@/components/ui/P'
import Formatter from 'utils/formatter'
import ArbiCoinGradientSvg from '@/components/svg/ArbiCoinGradientSvg'
import Button from '@/components/ui/Button'

interface Props {
}

export default function ShopBalance(props: Props) {
  const userContext = useUserContext()

  return (<div className={styles.root}> 
  
  <div className={styles.imageWrapper}>
    <Image src={shopImage} alt={'balance bucket'}  width={200} height={200}/>
  </div>

  <Title title={'Баланс профиля'} className={styles.title}/>

  <div className={styles.balance}>
    <ArbiCoinGradientSvg/>
    <P  styleType={['w600', 'huge']}>{Formatter.formatPrice(userContext.user.balance)}</P>
  </div>

  <Button styleType={['gradient', 'wide']}>Пополнить</Button>
  </div>)
}