import Title from '@/components/ui/TitleForSection'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import ItemNavigation from '@/components/ui/ItemNavigation'
import ShopBalance from './ShopBalance'
import ShopPackets from './ShopPackets'
import ShopOrders from './ShopOrders'
import { useTariffContext } from 'context/tariff_state'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useCvContext } from 'context/cv_state'
import { useVacancyContext } from 'context/vacancy_state'
import { useCharacterContext } from 'context/character_state'
import { PurchaseType } from 'types/enums'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

enum ShopPages  {
  Balance = 'balance',
  Packets = 'packets',
  Orders =  'orders'
}

export default function Shop(props: Props) {
  const {t} = useTranslation()
  const [page, setPage] = useState<ShopPages>(ShopPages.Balance)
  const tariffContext = useTariffContext()
  const userContext = useUserContext()
  const cvContext = useCvContext()
  const vacancyContext = useVacancyContext()
  const characterContext = useCharacterContext()
  const router = useRouter()

  useEffect(()=>{
    if(userContext.currentProfile.profileType === ProfileType.Employee) {
      cvContext.setSavedCvs()
      characterContext.init().then((res)=>{        
        tariffContext.setPackets([PurchaseType.CvTariff, !res&&PurchaseType.Character].filter(Boolean))
      })
    }
    else if(userContext.currentProfile.profileType === ProfileType.Hirer) {
      vacancyContext.setVacancies()
      tariffContext.setActiveSubscriptions([PurchaseType.ContactsOpen])   
      .then(res => {
        if(res.length > 0) {
          tariffContext.setPackets([PurchaseType.VacancyTariff, PurchaseType.ContactsOpen, PurchaseType.AddContactsOpen, PurchaseType.PersonalPage])
        }
        else {
          tariffContext.setPackets([PurchaseType.VacancyTariff, PurchaseType.ContactsOpen, PurchaseType.PersonalPage])
        }
      })  
    }
  }, [])

  useEffect(()=>{
    if(router.query.page) {
      setPage(router.query.page as ShopPages)
    }
  }, [router])

  const navSet = (()=>{
    const obj = Object.values(ShopPages)
    let result = obj.map(page => {
      switch(page) {
        case ShopPages.Balance:
          return {name: t('shop_balance'), type: page}
        case ShopPages.Packets:
          return {name: t('shop_packets'), type: page}
        case ShopPages.Orders:
          return {name: t('shop_orders'), type: page}
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
  <Title title={t('shop')}/>
  <ItemNavigation className={styles.itemNav} activeItem={page} items={navSet} onClick={setPage}/>

  {getPage}

  </div>)
}