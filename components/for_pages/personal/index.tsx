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

interface Props {
}

export default function PersonalPage(props: Props) {
  const personalContext = usePersonalContext()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(()=>{
    personalContext.setPersonalPage()  
  }, [])



  return (<div className={styles.root}> 
    {
      personalContext.personalPage === null && <Spinner size={24} />
      ||
      <>
      <PersonalHeader />
      <Content className={styles.content}>
        <ContentBody className={styles.body}>
          {isEditing &&
          <ContentItem className={styles.bodyItem}>
            <EditToolbar/>
          </ContentItem>
          }
          <ContentItem  className={styles.bodyItem}>
            <PersonalBody isEditing={isEditing}/>
          </ContentItem>
          
        </ContentBody>
        <ContentAside>
          <PersonalCard save={() => personalContext.updatePersonalPage()} isEditing={isEditing} switchMode={() => setIsEditing(!isEditing)}/>
        </ContentAside>
      </Content>
      </>
    }



  </div>)
}