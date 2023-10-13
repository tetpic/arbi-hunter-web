import LoupeSvg from 'components/svg/LoupeSvg'
import FiltersSvg from 'components/svg/FiltersSvg'
import Button from 'components/ui/Button'
import styles from './index.module.scss'
import SettingSvg from 'components/svg/SettingSvg'
import { useState } from 'react'
import classNames from 'classnames'

interface Props {
}

export default function ChatSearchBar(props: Props) {
  const [active, setActive] = useState<boolean>(false)

  return (<div className={styles.root}> 
    <div className={styles.rootWrapper}>
      <div className={classNames(styles.inputWrapper, active&&styles.inputWrapper_active)}>
        <LoupeSvg/>
        <input type="text" onFocus={()=>setActive(true)}  onBlur={()=>setActive(false)} placeholder='Поиск по чатам' />
      </div>
      <Button className={styles.filterButton}><FiltersSvg/></Button>
      <Button className={styles.button}><SettingSvg/></Button>
    </div>
    


  </div>)
}