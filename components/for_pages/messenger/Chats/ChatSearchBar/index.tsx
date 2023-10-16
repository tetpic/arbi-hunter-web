import LoupeSvg from 'components/svg/LoupeSvg'
import FiltersSvg from 'components/svg/FiltersSvg'
import Button from 'components/ui/Button'
import styles from './index.module.scss'
import { useState } from 'react'
import classNames from 'classnames'
import FolderClosedSvg from 'components/svg/FolderClosedSvg'

export default function ChatSearchBar() {
  const [active, setActive] = useState<boolean>(false)

  return (
  <div className={styles.root}> 
    <div className={styles.rootWrapper}>
      <div className={classNames(styles.inputWrapper, active&&styles.inputWrapper_active)}>
        <LoupeSvg/>
        <input type="text" onFocus={()=>setActive(true)}  onBlur={()=>setActive(false)} placeholder='Поиск по чатам' />
      </div>
      <Button className={styles.filterButton}><FiltersSvg/></Button>
      <Button className={styles.button}><FolderClosedSvg/></Button>
    </div>
  </div>
  )
}