import BasePage from 'components/for_pages/base'
import ContentLayout from 'components/layout/ContentLayout'
import { ProfileType } from 'data/interfaces/IRegistration'
import { CookiesType } from 'types/enums'

interface Props {
  profileType: ProfileType
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  const profile = context.req.cookies[CookiesType.profileType]
  return {props: {profile}}
}) 


export default function Base(props: Props) {

  return (<ContentLayout>
    <BasePage profileType={props.profileType}/>
  </ContentLayout>)
}