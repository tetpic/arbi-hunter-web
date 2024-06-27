import PersonalPage from 'components/for_pages/personal'
import ContentLayout from 'components/layout/ContentLayout'
import { PersonalWrapper } from 'context/personal_state'
import { IUserProfile } from 'data/interfaces/IUser'
import UserRepository from 'data/repositories/UserRepository'
import { CookiesType } from 'types/enums'



interface Query {
  id: string
  webViewOnly?: boolean
}

interface Props {
  id: number,
  webViewOnly?: boolean
  profile?: IUserProfile
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const id  = Number(context.query.id)
  const token = context.req.cookies[CookiesType.accessToken]
  const profileType = context.req.cookies[CookiesType.profileType]
  const webViewOnly = context?.query?.webViewOnly||null
  try{
    const profile = await UserRepository.getUserProfileById(id, token, profileType)
    return {props: {id, webViewOnly, profile}}
  }
  catch(err){
    return {props: undefined}
  }
}) 

export default function MyCompanyPage(props: Props) {

  return (
    <ContentLayout hideMobileHeader>
      <PersonalWrapper key={'id_personal_page'} profile={props.profile}>
        <PersonalPage id={props.id} webView={props.webViewOnly}/>
      </PersonalWrapper>
    </ContentLayout>
  )
}