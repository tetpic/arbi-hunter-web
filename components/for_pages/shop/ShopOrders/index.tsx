import { useTariffContext } from 'context/tariff_state'
import styles from './index.module.scss'
import PurchaseItem from '../PurchaseItem'
import TagList from '@/components/ui/TagList'
import { useState } from 'react'

interface Props {
}

enum PurchasedType {
  Bought = 'bought',
  Delayed = 'delayed',
  Archive = 'archive'
}

export default function ShopOrders(props: Props) {
  const tariffContext = useTariffContext()
  const [type, setType] = useState<PurchasedType>(PurchasedType.Bought)


  return (<div className={styles.root}> 
  <TagList tags={[
    {name: 'Купленные услуги', isActive: type=== PurchasedType.Bought, onClick: ()=>{setType(PurchasedType.Bought)}},
    {name: 'Отложенные заказы', isActive: type===PurchasedType.Delayed, onClick: ()=>{setType(PurchasedType.Delayed)}},
    {name: 'Архив пополнений', isActive: type ===PurchasedType.Archive, onClick: ()=>{setType(PurchasedType.Archive)}},
  ]}/>
    {[...tariffContext.purchased.values()].map(el => {
      return <PurchaseItem tariff={tariffContext.packets.get(el.subscription.tariffId)} purchase={el} type='info' />
    })}
  

  </div>)
}