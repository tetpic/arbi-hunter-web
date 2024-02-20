import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import Spinner from 'components/ui/Spinner'
import Content from 'components/ui/Content'
import ContentBody from 'components/ui/Content/ContentBody'
import ContentAside from 'components/ui/Content/ContentAside'
import PersonalHeader from './PersonalHeader'
import PersonalBody from './PersonalBody'
import PersonalCard from './PersonalCard'
import { usePersonalContext } from 'context/personal_state'
import ContentItem from 'components/ui/Content/ContentItem'
import EditToolbar from './EditToolbar'
import classNames from 'classnames'
import { BackgroundCategoryType } from 'data/interfaces/IBackground'
import { ProfileType } from 'data/interfaces/IRegistration'

interface Props {
  id?: number
}

export default function PersonalPage(props: Props) {
  const personalContext = usePersonalContext()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(()=>{
    personalContext.setPersonalPage({profileId: props.id}) 
    .then(res => {
      debugger
      personalContext.setBackgrounds(res)
    })
  }, [])

  if(personalContext.loading) {
    return <Spinner size={24} />
  }

  return (<div className={styles.root}> 
    {
      personalContext.personalPage === null && <Spinner size={24} />
      ||
      <>
      { !isEditing && 
        (
          (personalContext.currentProfile.profileType === ProfileType.Hirer && personalContext.backgrounds.get(BackgroundCategoryType.Places) && personalContext.backgrounds.get(BackgroundCategoryType.Buildings) && personalContext.currentProfile.logo)
          ||
          (personalContext.currentProfile.profileType === ProfileType.Employee && personalContext.backgrounds.get(BackgroundCategoryType.Places) && personalContext.currentProfile.logo && personalContext.currentProfile.useOwnLogo) 
        )
        &&
        <PersonalHeader isEditing={!props.id&&isEditing}/>
        ||
        isEditing && <PersonalHeader isEditing={!props.id&&isEditing}/>
      }
      <Content className={styles.content}>
        <ContentBody className={styles.body}>
          {isEditing && 
          <ContentItem className={classNames(styles.bodyItem, isEditing&&styles.bodyItem_edit)}>
            <EditToolbar/>
          </ContentItem>
          }
          <ContentItem  className={styles.bodyItem}>
            <PersonalBody isEditing={!props.id&&isEditing}/>
          </ContentItem>
        </ContentBody>

        <ContentAside className={styles.aside}>
          <PersonalCard save={() => personalContext.updatePersonalPage()} isEditable={!props.id} isEditing={!props.id&&isEditing} switchMode={() => !props.id&&setIsEditing(!isEditing)}/>
        </ContentAside>
      </Content>
      </>
    }
  </div>)
}