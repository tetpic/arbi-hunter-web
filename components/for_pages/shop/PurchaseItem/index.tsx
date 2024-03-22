import { ITariff } from 'data/interfaces/Common'
import styles from './index.module.scss'
import P from '@/components/ui/P'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import Formatter from 'utils/formatter'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { PurchasePreviewModalArgs } from '@/components/modals/PurchasePreviewModal'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { FILES } from 'types/constants'


interface Props {
  tariff: ITariff
}

export default function PurchaseItem({tariff}: Props) {
  const appContext = useAppContext()


  const showPreviewModal = (tariff: ITariff) => {
    appContext.showModal<PurchasePreviewModalArgs>(ModalType.PurchasePreviewModal, {
      tariff: tariff
    })
  }

  // @ts-ignore
  return (<div className={styles.item} key={tariff.id} style={{'--gradientColor1': '#'+tariff.colors[0], '--gradientColor2': '#'+tariff.colors[1]}}>
  {tariff.icon &&
    <Image src={FILES + tariff.icon?.source} alt={'item icon'} width={60} height={60} className={styles.icon}/>
  }
  <P styleType={['w600', 'large']} className={styles.title}>{tariff.name}</P>
  {tariff.price > 0 &&
    <P 
    styleType={['alignCenter', 'w500', 'medium']} 
    className={styles.price}>
      <ArbiCoinSvg/> 
      {tariff.price} {Formatter.pluralize(tariff.price, 'арбикоин', 'арбикоина', 'арбикоинов')} / {tariff.period} {Formatter.pluralize(tariff.period, 'день', 'дня', 'дней')}
    </P>
  }
  {tariff.price === 0 &&
    <P styleType={['alignCenter', 'w500', 'medium']} className={styles.price}>Бесплатно</P>
  } 
  <P>{tariff.description}</P>
  <Button styleType={['gradient', 'wide']} className={styles.button} onClick={()=>showPreviewModal(tariff)}>Купить</Button>
</div>)
}