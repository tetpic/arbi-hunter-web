import Button from 'components/ui/Button'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import UserPic from 'components/ui/UserPic'
import { useManagerContext } from 'context/manager_state'
import { useUserContext } from 'context/user_state'
import { IManager, IManagerCreate } from 'data/interfaces/IManager'
import ManagerRepository from 'data/repositories/ManagerRepository'
import { useState } from 'react'
import { HirerRole } from 'types/enums'
import { TranslateHirerRole } from 'utils/enumsTranslations'
import ManagerDropdownMenu from '../ManagerDropdown'
import styles from './index.module.scss'


interface ManagerProps {
  manager: IManager  
  onEdit: ()=>void
  onRemove: () => void
}

export default function Manager({manager, onEdit, onRemove}: ManagerProps) {
  
  const {currentProfile} = useUserContext()
  const managerContext = useManagerContext()
  const [loading, setIsLoading] = useState<boolean>(false)
  const [dropdownActive, setDropDown] = useState<boolean>()


  //перенести в контекст!!!!!
  const setAdminHandler = () => {
    const changeRoleTo = manager.hirerRole === HirerRole.Admin&&HirerRole.Manager||manager.hirerRole === HirerRole.Manager&&HirerRole.Admin
    const data: IManagerCreate = {
      firstName: manager.firstName,
      lastName: manager.lastName,
      permissions: manager.permissions,
      hirerRole: changeRoleTo,
      position: manager.position,
      email: manager.email,
      phone: manager.phone
    }
    setIsLoading(true)
    ManagerRepository.editManagerById(data, manager.id, currentProfile.profileType)
    .then(res=>{
      setIsLoading(false)
      managerContext.setManagers()
    })
  }

  return (
    <div className={styles.item}>
      <div className={styles.top}>
        <UserPic size={42} className={styles.userPic}/>
        <p className={styles.name}>{manager.firstName} {manager.lastName}</p>
        <p className={styles.role}>{TranslateHirerRole(manager.hirerRole)}</p>
        <ThreeDotsButton onClick={()=>setDropDown(state=> state&&false||!state&&true)} className={styles.edit}/>
        {dropdownActive && 
          <ManagerDropdownMenu 
          onClose={()=>setDropDown(false)} 
          onEdit={onEdit} 
          onRemove={onRemove}
          />     
        }
      </div>
      <p className={styles.stats}>367 просмотров за неделю</p>
      <Button isProcess={loading}  className={styles.setAdmin} onClick={setAdminHandler}>Сделать {
      manager.hirerRole===HirerRole.Manager&&'администратором'
      ||
      manager.hirerRole===HirerRole.Admin&&'менеджером'
      }</Button>
    </div>
  )
}