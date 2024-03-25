import { useTariffContext } from 'context/tariff_state'
import styles from './index.module.scss'
import PurchaseItem from '../PurchaseItem'
import { useUserContext } from 'context/user_state'
import { useCvContext } from 'context/cv_state'
import { useVacancyContext } from 'context/vacancy_state'
import { ProfileType } from 'data/interfaces/IRegistration'

interface Props {
}

export default function ShopPackets(props: Props) {
  const tariffContext = useTariffContext()
  const userContext = useUserContext()
  const cvContext = useCvContext()
  const vacancyContext = useVacancyContext()




  return (<div className={styles.root}> 
    {[...tariffContext.packets.entries()].filter(([key, value]) => value.price > 0).map(([key, value])=> {
      return <PurchaseItem 
      tariff={value} 
      cvs={userContext.currentProfile.profileType === ProfileType.Employee&&cvContext.savedCvs.filter(el=> el.published === true && el.moderationStatus === 'approved'/*&&!el.subscriptions*/)} 
      vacancies={userContext.currentProfile.profileType === ProfileType.Hirer&&[...vacancyContext.activeVacancies.values()]/*.filter(el=>!el.subscriptions)*/}/>
    })}

  </div>)
}