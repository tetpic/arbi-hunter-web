import Modes from '@/components/ui/Modes'
import styles from './index.module.scss'
import { useState } from 'react'

interface Props {
}

enum BlackListModes {
  Vacancies = 'vacancies',
  Companies = 'companies'
}



export default function BlackList(props: Props) {
  const [type, setType] = useState<BlackListModes>(BlackListModes.Vacancies)

  return (<div className={styles.root}> 
    <div className={styles.top}>
      <Modes buttons={[
        {name: 'Вакансии', type: BlackListModes.Vacancies},
        {name: 'Компании', type: BlackListModes.Companies}
      ]} activeButton={type} 
      onSet={setType}
      className={styles.modes}
      buttonClassName={styles.modesButton}
      />
      
    </div>
  </div>)
}