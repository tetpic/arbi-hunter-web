import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import Spinner from 'components/ui/Spinner'
import PersonalHeader from './PersonalHeader'
import PersonalBody from './PersonalBody'
import PersonalCard from './PersonalCard'
import { usePersonalContext } from 'context/personal_state'
import ContentItem from 'components/ui/Content/ContentItem'
import EditToolbar from './EditToolbar'
import classNames from 'classnames'
import { BackgroundCategoryType } from 'data/interfaces/IBackground'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useUserContext } from 'context/user_state'
import Button from '@/components/ui/Button'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'

interface Props {
  id?: number
}

export default function PersonalPage(props: Props) {
  const {t} = useTranslation()
  const personalContext = usePersonalContext()
  const [isEditing, setIsEditing] = useState(false)
  const userContext = useUserContext()

  useEffect(()=>{
    personalContext.setPersonalPage({profileId: props.id}) 
    .then(res => {
      personalContext.setBackgrounds(res)
    })
  }, [])

  if(personalContext.loading) {
    return <Spinner size={24} />
  }

  if(personalContext.personalPage === null) {
    return <div className={styles.root}>
      <Spinner size={24} />
    </div>
  }

  const isHeaderExist = (
    (personalContext.currentProfile?.profileType === ProfileType.Hirer && personalContext.backgrounds?.get(BackgroundCategoryType.Places) && personalContext.currentProfile?.logo)
    ||
    (personalContext.currentProfile?.profileType === ProfileType.Employee && personalContext.backgrounds?.get(BackgroundCategoryType.Places)) 
  )

  return (<div className={styles.root}> 
    {!isEditing && isHeaderExist
      &&
      <PersonalHeader isEditing={!props.id&&isEditing}/>
      ||
      isEditing && <PersonalHeader isEditing={!props.id&&isEditing}/>
    }
    <PersonalCard 
    save={() => personalContext.updatePersonalPage()} 
    isEditable={!props.id} 
    noHeader={!isHeaderExist}
    isEditing={!props.id&&isEditing} 
    switchMode={() => !props.id&&setIsEditing(!isEditing)}
    />

    {isEditing && 
      <ContentItem className={classNames(styles.bodyItem, isEditing&&styles.bodyItem_edit)}>
        <EditToolbar/>
      </ContentItem>
    }
    <ContentItem  className={styles.bodyItem}>
      {personalContext.blocks.size > 0 &&
      <PersonalBody isEditing={!props.id&&isEditing}/>
      ||
      <P styleType={['w500', 'medium']}>Нет информации</P>
      }
    </ContentItem>
    {isEditing &&
      <Button 
      styleType={['gradient']} 
      onClick={() => {
        personalContext.updatePersonalPage()
        setIsEditing(!isEditing)
      }} 
      className={styles.saveButton}>{t('save')}</Button>
    }
  </div>)
}