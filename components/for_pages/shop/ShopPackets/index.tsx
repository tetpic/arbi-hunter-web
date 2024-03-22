import { useTariffContext } from 'context/tariff_state'
import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import PurchaseItem from '../PurchaseItem'

interface Props {
}

export default function ShopPackets(props: Props) {
  const tariffContext = useTariffContext()
  const appContext = useAppContext()



  return (<div className={styles.root}> 
    {[...tariffContext.packets.entries()].map(([key, value])=> {
      return <PurchaseItem tariff={value}/>
    })}

  </div>)
}