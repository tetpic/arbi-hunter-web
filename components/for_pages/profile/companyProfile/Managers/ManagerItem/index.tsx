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
import useTranslation from 'next-translate/useTranslation'


interface ManagerProps {
  manager: IManager  
  onEdit: ()=>void
  onRemove: () => void
}

export default function Manager({manager, onEdit, onRemove}: ManagerProps) {
  const {t} = useTranslation()
  const managerContext = useManagerContext()
  const userContext = useUserContext()
  const [loading, setIsLoading] = useState<boolean>(false)
  const [dropdownActive, setDropDown] = useState<boolean>()

  const setAdminHandler = () => {
    const changeRoleTo = manager.hirerRole === HirerRole.Admin&&HirerRole.Manager
      ||manager.hirerRole === HirerRole.Manager&&HirerRole.Admin
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

  const canIEdit = (!userContext.currentProfile?.hirerRole || userContext.currentProfile?.hirerRole === HirerRole.Admin) 
  && manager.id !== userContext.currentProfile?.id

  return (
    <div className={styles.item}>
      <div className={styles.top}>
        <UserPic size={42} className={styles.userPic}/>
        <P styleType={['large', 'w600']} useThemeColor className={styles.name}>{manager.firstName} {manager.lastName}</P>
        <P styleType={['medium', 'w500', 'greyLight']} className={styles.role}>{TranslateHirerRole(manager.hirerRole, t)}</P>
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
      <P styleType={['medium', 'w500', 'greyLight']}>{t('managers_vcCount')} <span className={styles.count}>{manager.viewsOfVacanciesCount}</span></P>
      <P styleType={['medium', 'w500', 'greyLight']}>{t('managers_feedbacks')} <span className={styles.count}>0</span></P>
      <P styleType={['medium', 'w500', 'greyLight']}>{t('managers_watched')} <span className={styles.count}>{manager.viewsOfVacanciesCount}</span></P>
      <P styleType={['medium', 'w500', 'greyLight']}>{t('managers_answered')} <span className={styles.count}>{manager.applicationsToVacanciesCount}</span></P>
      {canIEdit &&
        <Button isProcess={loading} className={styles.setAdmin}  styleType={['borderGradient', 'black']} altStyleType={['whitePurple']}  onClick={setAdminHandler}>
        {
          manager.hirerRole===HirerRole.Manager&&t('managers_setAdmin')
        ||
          manager.hirerRole===HirerRole.Admin&&t('managers_setManager')
        }
        </Button>
      }
    </div>
  )
}