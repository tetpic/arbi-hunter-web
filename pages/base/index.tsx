// import Development from '@/components/ui/Development'
import BasePage from 'components/for_pages/base'
import ContentLayout from 'components/layout/ContentLayout'
import { KnowledgeWrapper } from 'context/knowledge_state'

export default function Base() {
  // return (
  //   <ContentLayout>
  //      <Development/>
  //   </ContentLayout>
  // )


  return (<ContentLayout hideMobileHeader>
    <KnowledgeWrapper>
      <BasePage />
    </KnowledgeWrapper>
  </ContentLayout>)
}