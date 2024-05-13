import { useTariffContext } from 'context/tariff_state'
import styles from './index.module.scss'
import PurchaseItem from '../PurchaseItem'
import TagList from '@/components/ui/TagList'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

enum PurchasedType {
  Bought = 'bought',
  Delayed = 'delayed',
  Archive = 'archive'
}

export default function ShopOrders(props: Props) {
  const {t} = useTranslation()
  const tariffContext = useTariffContext()
  const [type, setType] = useState<PurchasedType>(PurchasedType.Bought)


  return (<div className={styles.root}> 
  <TagList className={styles.tagListRoot} tagListClassName={styles.tagList} tags={[
    {name: t('shop_purchased'), isActive: type=== PurchasedType.Bought, onClick: ()=>{setType(PurchasedType.Bought)}},
    {name: t('shop_delayedPurchases'), isActive: type===PurchasedType.Delayed, onClick: ()=>{setType(PurchasedType.Delayed)}},
    {name: t('shop_paymentsArchive'), isActive: type ===PurchasedType.Archive, onClick: ()=>{setType(PurchasedType.Archive)}},
  ]}/>
    {[...tariffContext.purchased.values()].map(el => {
      return <PurchaseItem tariff={tariffContext.packets.get(el.subscription.tariffId)} purchase={el} type='info' />
    })}
  

  </div>)
}