// import classnames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import Button from 'components/ui/Button'
import Spinner from 'components/ui/Spinner'
import { useManagerContext } from 'context/manager_state'
import { IManager } from 'data/interfaces/IManager'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { colors } from 'styles/variables'
import AddManager from './AddManager'
import styles from './index.module.scss'
import Manager from './ManagerItem'

interface Props {
}



export default function Managers(props: Props) {

  const managerContext = useManagerContext()
  const [addManagerModal, showManagerModal] = useState<boolean>(false)
  const [managerToEdit, setManagerToEdit] = useState<IManager>()
  const {isTabletWidth} = useResize()

  const removeManagerHandler = (el: IManager) => {
    
  }

  useEffect(()=>{
    managerToEdit?showManagerModal(true):showManagerModal(false)
  }, [managerToEdit])
 
  useEffect(()=>{
    managerContext.setManagers(1)  
  }, [])

  return (<div className={styles.root}> 
    <div className={styles.head}>
      {/* <div className={styles.findButtons}>
        <Button className={classnames(styles.findButton, styles.findButton_active)}>Все менеджеры</Button>
        <Button className={styles.findButton} >Показать администратора</Button>
      </div> */}
      {!isTabletWidth &&
        <Button className={styles.addButton} onClick={()=>showManagerModal(true)}>Добавить менеджера</Button>
      }
    </div>

    <div className={styles.managers}>
      <InfiniteScroll 
      height={'100%'}
      next={()=>{managerContext.setManagers(managerContext.managersPage+1)}} 
      hasMore={true} 
      loader={<Spinner size={24} color={colors.yellow}/>} 
      dataLength={0}>
         {managerContext.managers&& managerContext.managers.size > 0 && 
           [...managerContext.managers.values()].map(el=> {
             return <Manager onEdit={()=>setManagerToEdit(el)}  onRemove={()=>removeManagerHandler(el)}  manager={el}/>
           })
         }
      </InfiniteScroll>
      {isTabletWidth && 
         <Button className={styles.addButton} onClick={()=>showManagerModal(true)}>Добавить менеджера</Button>
      }
    </div>
    {addManagerModal && <AddManager managerToEdit={managerToEdit} onClose={()=>{showManagerModal(false); setManagerToEdit(null)}}/>}
  </div>)
}