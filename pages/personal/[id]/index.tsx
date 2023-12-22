import PersonalPage from 'components/for_pages/personal'
import ContentLayout from 'components/layout/ContentLayout'
import { PersonalWrapper } from 'context/personal_state'

interface Props {
  id: number
}

interface Query {
  id: string
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const id  = Number(context.query.id)
    try{
      return {props: {id}}
    }
    catch(err){
      return {props: undefined}
    }
}) 

export default function MyCompanyPage(props: Props) {

  return (
    <ContentLayout hideMobileHeader>
      <PersonalWrapper>
        <PersonalPage id={props.id}/>
      </PersonalWrapper>
    </ContentLayout>
  )
}