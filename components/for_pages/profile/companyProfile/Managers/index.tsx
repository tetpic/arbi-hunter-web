import styles from './index.module.scss'

import { useResize } from 'components/hooks/useResize'
import Button from 'components/ui/Button'
import Spinner from 'components/ui/Spinner'
import { useManagerContext } from 'context/manager_state'
import { IManager } from 'data/interfaces/IManager'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { colors } from 'styles/variables'
import AddManager from './AddManager'
import Manager from './ManagerItem'
import Title from '@/components/ui/TitleForSection'
import { useUserContext } from 'context/user_state'
import { HirerRole } from 'types/enums'
import P from '@/components/ui/P'


export default function Managers() {

  const managerContext = useManagerContext()
  const userContext = useUserContext()
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
    <Title title={'Менеджеры'}/>


    <div className={styles.managers}>
      <InfiniteScroll 
      height={'100%'}
      next={()=>{managerContext.setManagers(managerContext.managersPage+1)}} 
      hasMore={managerContext.managers.size < managerContext.managersTotal} 
      loader={<Spinner size={24} color={colors.blue}/>} 
      dataLength={0}>
         {managerContext.managers&& managerContext.managers.size > 0 && 
           [...managerContext.managers.values()].map((el, index)=> {
            return (
              <Manager 
              key={index} 
              onEdit={()=>setManagerToEdit(el)}  
              onRemove={()=>removeManagerHandler(el)}  
              manager={el}/>
            )
           })
           ||
           managerContext.managers.size === 0 && managerContext.managersTotal === 0 &&
           <P useThemeColor className={'empty'}>Нет добавленных менеджеров</P>
         }
      </InfiniteScroll>
      {isTabletWidth && 
         <Button className={styles.addButton} onClick={()=>showManagerModal(true)}>Добавить менеджера</Button>
      }
    </div>
    <div className={styles.head}>
      {!isTabletWidth && (userContext.currentProfile?.hirerRole === HirerRole.Admin || !userContext.currentProfile?.hirerRole) &&
        <Button className={styles.addButton} onClick={()=>showManagerModal(true)}>Добавить менеджера</Button>
      }
    </div>
    {addManagerModal && <AddManager managerToEdit={managerToEdit} onClose={()=>{showManagerModal(false); setManagerToEdit(null)}}/>}
  </div>)
}