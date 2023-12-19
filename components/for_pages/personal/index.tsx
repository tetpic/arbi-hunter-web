import styles from './index.module.scss'

import { useEffect } from 'react'
import Spinner from 'components/ui/Spinner'
import Content from 'components/ui/Content'
import ContentBody from 'components/ui/Content/ContentBody'
import ContentAside from 'components/ui/Content/ContentAside'
import PersonalHeader from './PersonalHeader'
import PersonalBody from './PersonalBody'
import PersonalCard from './PersonalCard'
import { usePersonalContext } from 'context/personal_state'

interface Props {
}

export default function PersonalPage(props: Props) {
  const personalContext = usePersonalContext()

  useEffect(()=>{
    personalContext.setPersonalPage()  
  }, [])

  return (<div className={styles.root}> 
    {
      !personalContext.personalPage && <Spinner size={24} />
      ||
      <>
      <PersonalHeader/>
      <Content className={styles.content}>
        <ContentBody className={styles.contentBody}>
          <PersonalBody />
        </ContentBody>
        <ContentAside>
          <PersonalCard/>
        </ContentAside>
      </Content>
      </>
      
    }



  </div>)
}