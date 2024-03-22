import Title from '@/components/ui/TitleForSection'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import ItemNavigation from '@/components/ui/ItemNavigation'
import ShopBalance from './ShopBalance'
import ShopPackets from './ShopPackets'
import ShopOrders from './ShopOrders'
import { useTariffContext } from 'context/tariff_state'
import { useUserContext } from 'context/user_state'

interface Props {
}

enum ShopPages  {
  Balance = 'balance',
  Packets = 'packets',
  Orders =  'orders'
}

export default function Shop(props: Props) {
  const [page, setPage] = useState<ShopPages>(ShopPages.Balance)
  const tariffContext = useTariffContext()
  const userContext = useUserContext()

  useEffect(()=>{
    tariffContext.setPackets(userContext.currentProfile.profileType)
  }, [])




  const navSet = (()=>{
    const obj = Object.values(ShopPages)
    let result = obj.map(page => {
      switch(page) {
        case ShopPages.Balance:
          return {name: 'Баланс', type: page}
        case ShopPages.Packets:
          return {name: 'Пакеты услуг', type: page}
        case ShopPages.Orders:
          return {name: 'Заказы', type: page}
      }
    })
    return result
  })()

  const getPage = (() => {
    switch(page){
      case ShopPages.Balance:
        return <ShopBalance/>
      case ShopPages.Packets:
        return <ShopPackets/>
      case ShopPages.Orders:
        return <ShopOrders/>
    }
  })()

  return (<div className={styles.root}> 
  <Title title={'Магазин'}/>
  <ItemNavigation className={styles.itemNav} activeItem={page} items={navSet} onClick={setPage}/>

  {getPage}

  </div>)
}