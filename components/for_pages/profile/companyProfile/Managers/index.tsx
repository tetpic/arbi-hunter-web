import classnames from 'classnames'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import Button from 'components/ui/Button'
import CustomScrollbar from 'components/ui/CustomScrollbar'
import IconButton from 'components/ui/IconButton'
import UserPic from 'components/ui/UserPic'
import { useState } from 'react'
import AddManager from './AddManager'
import styles from './index.module.scss'

interface Props {
}

interface ManagerProps {

}

function Manager(props: ManagerProps) {
  return (
    <div className={styles.item}>
      <div className={styles.top}>
        <UserPic size={42} className={styles.userPic}/>
        <p className={styles.name}>Михаил Михаилов</p>
        <p className={styles.role}>Администратор</p>
        <IconButton bgColor={'transparent'} className={styles.remove}><TrashBasketSvg/></IconButton>
      </div>
      <p className={styles.stats}>367 просмотров за неделю</p>
      <Button className={styles.setAdmin}>Сделать администратором</Button>
    </div>
  )
}

export default function Managers(props: Props) {

  const [addManagerModal, showManagerModal] = useState<boolean>(false)

  return (<div className={styles.root}> 
    <div className={styles.head}>
      <Button className={classnames(styles.findButton, styles.findButton_active)}>Все менеджеры</Button>
      <Button className={styles.findButton}>Показать администратора</Button>
      <Button className={styles.addButton} onClick={()=>showManagerModal(true)}>Добавить менеджера</Button>
    </div>

    <div className={styles.managers}>
      <CustomScrollbar>
      <Manager/>
      <Manager/>
      <Manager/>
      <Manager/>
      <Manager/>
      </CustomScrollbar>
    </div>
    {addManagerModal && <AddManager onClose={()=>showManagerModal(false)}/>}
  </div>)
}