import styles from './index.module.scss'

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
import { useAppContext } from 'context/state'
import useTranslation from 'next-translate/useTranslation'


export default function Managers() {
  const {t} = useTranslation()
  const managerContext = useManagerContext()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const [addManagerModal, showManagerModal] = useState<boolean>(false)
  const [managerToEdit, setManagerToEdit] = useState<IManager>()
  

  const removeManagerHandler = (el: IManager) => {
    managerContext.removeManager(el.id)
  }

  useEffect(()=>{
    managerToEdit?showManagerModal(true):showManagerModal(false)
  }, [managerToEdit])
 
  useEffect(()=>{
    managerContext.setManagers(1)  
  }, [])



  return (<>{!addManagerModal && <div className={styles.root}> 
    <Title title={t('nav_managers')}/>
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
           <P useThemeColor className={'empty'}>{t('managers_noAdded')}</P>
         }
      </InfiniteScroll>
      {isTabletWidth && 
         <Button className={styles.addButton} onClick={()=>showManagerModal(true)}>{t('managers_addNew')}</Button>
      }
    </div>
    <div className={styles.head}>
      {!isTabletWidth && (userContext.currentProfile?.hirerRole === HirerRole.Admin || !userContext.currentProfile?.hirerRole) &&
        <Button className={styles.addButton} onClick={()=>showManagerModal(true)}>{t('managers_addNew')}</Button>
      }
    </div>

  </div>
  ||
  <AddManager managerToEdit={managerToEdit} onClose={()=>{
    showManagerModal(false)
    setManagerToEdit(null)
    managerContext.setManagers(1) 

  }}/>

  }</>)
}