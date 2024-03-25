import { useTariffContext } from 'context/tariff_state'
import styles from './index.module.scss'
import PurchaseItem from '../PurchaseItem'
import { useUserContext } from 'context/user_state'
import { useCvContext } from 'context/cv_state'
import { useVacancyContext } from 'context/vacancy_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useCharacterContext } from 'context/character_state'
import { PurchaseType } from 'types/enums'

interface Props {
}

export default function ShopPackets(props: Props) {
  const tariffContext = useTariffContext()
  const userContext = useUserContext()
  const cvContext = useCvContext()
  const vacancyContext = useVacancyContext()
  const characterContext = useCharacterContext()

  return (<div className={styles.root}> 
    {[...tariffContext.packets.entries()].filter(([key, value]) => value.price > 0 && (characterContext.currentCharacter.current?.purchased?value.purchaseType !== PurchaseType.Character:true) ).map(([key, value])=> {
      return <PurchaseItem 
      type='buy'
      tariff={value} 
      cvs={userContext.currentProfile.profileType === ProfileType.Employee&&cvContext.savedCvs.filter(el=> el.published === true && el.moderationStatus === 'approved'/*&&!el.subscriptions*/)} 
      vacancies={userContext.currentProfile.profileType === ProfileType.Hirer&&[...vacancyContext.activeVacancies.values()]/*.filter(el=>!el.subscriptions)*/}/>
    })}
  </div>)
}