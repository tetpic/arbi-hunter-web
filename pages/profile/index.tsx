import Profile from 'components/for_pages/profile'
import ContentLayout from 'components/layout/ContentLayout'
import { CharacterWrapper } from 'context/character_state'
import { FeedbacksWrapper } from 'context/feedbacks_state'
import { ProfilePageWrapper } from 'context/profile_page_state'
import { VacancyWrapper } from 'context/vacancy_state'
import useTranslation from 'next-translate/useTranslation'
import { CookiesType } from 'types/enums'

interface Query {
  page: string
}

interface Props extends Query {

}

export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
  const page = context.query.page||null
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  if(profileType && token) {
    return {props: {page}}
  }
  else {
    return {redirect: {destination: '/login', permanent: false} }
  }
}) 

export default function ProfilePage(props: Props) {
  const {t} = useTranslation()

  return (
    <ContentLayout hideMobileHeader title={t('profile')}>
      <ProfilePageWrapper page={props.page}>
        <CharacterWrapper>
          <FeedbacksWrapper>
          <VacancyWrapper>
            <Profile/>
          </VacancyWrapper>
          </FeedbacksWrapper>
        </CharacterWrapper>
      </ProfilePageWrapper>
    </ContentLayout>
 
  )
}