import styles from './index.module.scss'

import { IVacancy } from 'data/interfaces/IVacancy'
import SalaryItem from 'components/ui/SalaryItem'
import Button from 'components/ui/Button'
import Formatter from 'utils/formatter'
import defaultImage from 'images/recruiting/vacancyDefaultImage.png'
import Image from 'next/image'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { useCvContext } from 'context/cv_state'
import { IApplicationModalProps } from 'components/modals/ApplicationModal'

interface Props {
  vacancy?: IVacancy
}

export default function VacancyItem({vacancy}: Props) {
  const appContext = useAppContext()
  const cvContext = useCvContext()

  const respondHandler = () => {
    appContext.showModal<IApplicationModalProps>(ModalType.ApplicationModal, {cvs: cvContext.savedCvs, vacancyId: vacancy.id})
  }

  return (<div className={styles.item}> 
    <Image className={styles.image} src={defaultImage} alt={'def image'} width={244} height={220}/>
    <div className={styles.top}>
      <p className={styles.name}>{vacancy.company}</p>
      {vacancy.city && vacancy.city.locName && !vacancy.isRemote &&
        <p className={styles.city}>г. {vacancy.city?.locName}</p>
      }
      <p className={styles.name}>{vacancy.name}</p>
      {vacancy.isRemote &&
        <p className={styles.city}>Удаленно</p>
      }
      <SalaryItem vacancy={vacancy}/>
      <p className={styles.time}>{Formatter.formatToShortYear(vacancy.updatedAt)}</p>
    </div>
    <div className={styles.buttonsWrapper}>
      <Button className={styles.button} onClick={respondHandler}>Откликнуться</Button>
    </div>
  </div>)
}