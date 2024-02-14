import styles from './index.module.scss'

import Button from 'components/ui/Button'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import UserPic from 'components/ui/UserPic'
import { useManagerContext } from 'context/manager_state'
import { IManager, IManagerCreate } from 'data/interfaces/IManager'
import ManagerRepository from 'data/repositories/ManagerRepository'
import { useState } from 'react'
import { HirerRole } from 'types/enums'
import { TranslateHirerRole } from 'utils/enumsTranslations'
import ManagerDropdownMenu from '../ManagerDropdown'
import { useUserContext } from 'context/user_state'
import P from '@/components/ui/P'


interface ManagerProps {
  manager: IManager  
  onEdit: ()=>void
  onRemove: () => void
}

export default function Manager({manager, onEdit, onRemove}: ManagerProps) {
  const managerContext = useManagerContext()
  const userContext = useUserContext()
  const [loading, setIsLoading] = useState<boolean>(false)
  const [dropdownActive, setDropDown] = useState<boolean>()

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
    ManagerRepository.editManagerById(data, manager.id)
    .then(res=>{
      setIsLoading(false)
      managerContext.setManagers()
    })
  }

  const canIEdit = (!userContext.currentProfile.hirerRole || userContext.currentProfile.hirerRole === HirerRole.Admin) && manager.id !== userContext.currentProfile.id

  return (
    <div className={styles.item}>
      <div className={styles.top}>
        <UserPic size={42} className={styles.userPic}/>
        <p className={styles.name}>{manager.firstName} {manager.lastName}</p>
        <p className={styles.role}>{TranslateHirerRole(manager.hirerRole)}</p>
        {canIEdit &&
          <ThreeDotsButton onClick={()=>setDropDown(state=> state&&false||!state&&true)} className={styles.edit}/>
        }
        {dropdownActive && 
          <ManagerDropdownMenu 
          onClose={()=>setDropDown(false)} 
          onEdit={onEdit} 
          onRemove={onRemove}
          />     
        }
      </div>
      <P styleType={['medium', 'w500', 'greyLight']}>Количество вакансий <span className={styles.count}>0</span></P>
      <P styleType={['medium', 'w500', 'greyLight']}>Отклики <span className={styles.count}>0</span></P>
      <P styleType={['medium', 'w500', 'greyLight']}>Просмотрено <span className={styles.count}>0</span></P>
      <P styleType={['medium', 'w500', 'greyLight']}>Отвечено <span className={styles.count}>0</span></P>
      {canIEdit &&
        <Button isProcess={loading}  className={styles.setAdmin} onClick={setAdminHandler}>Сделать {
          manager.hirerRole===HirerRole.Manager&&'администратором'
        ||
        manager.hirerRole===HirerRole.Admin&&'менеджером'
        }</Button>
      }
    </div>
  )
}