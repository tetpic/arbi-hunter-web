import PersonalPage from 'components/for_pages/personal'
import ContentLayout from 'components/layout/ContentLayout'
import { PersonalWrapper } from 'context/personal_state'



interface Query {
  id: string
  webViewOnly?: boolean
}

interface Props {
  id: number,
  webViewOnly?: boolean
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const id  = Number(context.query.id)
  const webViewOnly = context?.query?.webViewOnly||null
  // return {props: {webViewOnly}}

    try{
      return {props: {id, webViewOnly}}
    }
    catch(err){
      return {props: undefined}
    }
}) 

export default function MyCompanyPage(props: Props) {

  return (
    <ContentLayout hideMobileHeader>
      <PersonalWrapper key={'id_personal_page'}>
        <PersonalPage id={props.id} webView={props.webViewOnly}/>
      </PersonalWrapper>
    </ContentLayout>
  )
}