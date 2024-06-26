import Views from '@/components/for_pages/views'
import ContentLayout from '@/components/layout/ContentLayout'
import { VacancyWrapper } from 'context/vacancy_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { CookiesType } from 'types/enums'


interface Props {
  profileType: ProfileType
}

export const getServerSideProps = (async (context: {req: { cookies: { [x: string]: any } } }) => {
  const token = context.req.cookies[CookiesType.accessToken]
  const profileType = context.req.cookies[CookiesType.profileType]
  if(token) {
    return {props: {profileType: profileType}}
  }
  else {
    return {redirect: {destination: '/login', permanent: false} }
  }
}) 

export default function ViewsPage(props: Props) {
  

  return (
    <ContentLayout hideMobileHeader>
      {props.profileType === ProfileType.Employee &&       
          <Views profileType={props.profileType} />       
        ||
        <VacancyWrapper>
          <Views profileType={props.profileType} />
        </VacancyWrapper>
      }
    </ContentLayout>
)
}