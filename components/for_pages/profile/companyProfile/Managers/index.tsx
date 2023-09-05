import classnames from 'classnames'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import Button from 'components/ui/Button'
import IconButton from 'components/ui/IconButton'
import UserPic from 'components/ui/UserPic'
import { useManagerContext } from 'context/manager_state'
import { useUserContext } from 'context/user_state'
import { IManager } from 'data/interfaces/IManager'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { TranslateHirerRole } from 'utils/enumsTranslations'
import AddManager from './AddManager'
import styles from './index.module.scss'

interface Props {
}

interface ManagerProps {
  manager: IManager
}

function Manager({manager}: ManagerProps) {
  return (
    <div className={styles.item}>
      <div className={styles.top}>
        <UserPic size={42} className={styles.userPic}/>
        <p className={styles.name}>{manager.firstName} {manager.lastName}</p>
        <p className={styles.role}>{TranslateHirerRole(manager.hirerRole)}</p>
        <IconButton bgColor={'transparent'} className={styles.remove}><TrashBasketSvg/></IconButton>
      </div>
      <p className={styles.stats}>367 просмотров за неделю</p>
      <Button className={styles.setAdmin}>Сделать администратором</Button>
    </div>
  )
}

export default function Managers(props: Props) {

  const managerContext = useManagerContext()

  const [addManagerModal, showManagerModal] = useState<boolean>(false)

  const limit = 5

  useEffect(()=>{
    managerContext.setManagers(1, limit)  
  }, [])

  return (<div className={styles.root}> 
    <div className={styles.head}>
      <Button className={classnames(styles.findButton, styles.findButton_active)}>Все менеджеры</Button>
      <Button className={styles.findButton}>Показать администратора</Button>
      <Button className={styles.addButton} onClick={()=>showManagerModal(true)}>Добавить менеджера</Button>
    </div>

    <div className={styles.managers}>
     <InfiniteScroll 
     next={()=>{managerContext.setManagers(managerContext.managersPage+1, limit)}} 
     hasMore={true} 
     loader={''} 
     dataLength={0}>
        {managerContext.managers&& managerContext.managers.size > 0 && 
          [...managerContext.managers.values()].map(el=> {
            return <Manager manager={el} />
          })
        }
     </InfiniteScroll>
    </div>
    {addManagerModal && <AddManager onClose={()=>showManagerModal(false)}/>}
  </div>)
}