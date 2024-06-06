import { useTariffContext } from 'context/tariff_state'
import styles from './index.module.scss'
import PurchaseItem from '../PurchaseItem'
import { useUserContext } from 'context/user_state'
import { useCvContext } from 'context/cv_state'
import { useVacancyContext } from 'context/vacancy_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { PurchaseType } from 'types/enums'

interface Props {
  purchaseTypes?: string[]
}

export default function ShopPackets(props: Props) {
  const tariffContext = useTariffContext()
  const userContext = useUserContext()
  const cvContext = useCvContext()
  const vacancyContext = useVacancyContext()

  const onCvVcUpdate = () => {
    switch(userContext.currentProfile?.profileType) {
      case ProfileType.Employee: {
        cvContext.setSavedCvs()
        break
      }
      case ProfileType.Hirer: {
        vacancyContext.setVacancies()
        break
      }
    }
  }

  return (<div className={styles.root}> 
    {[...tariffContext.packets.entries()].filter(([key, value]) => value.purchaseType === PurchaseType.Character||(props.purchaseTypes?props.purchaseTypes.includes(value.purchaseType): true) ).map(([key, value])=> {
      return <PurchaseItem 
      type='buy'
      tariff={value} 
      onCvVcUpdate={onCvVcUpdate}
      cvs={userContext.currentProfile?.profileType === ProfileType.Employee&&cvContext.savedCvs.filter(el=> el.published === true/*&&!el.subscriptions*/)} 
      vacancies={userContext.currentProfile?.profileType === ProfileType.Hirer&&[...vacancyContext.activeVacancies.values()]/*.filter(el=>!el.subscriptions)*/}/>
    })}
  </div>)
}