import Vacancy from 'components/for_pages/create/Vacancy'
import ContentLayout from 'components/layout/ContentLayout'
import { CreateVcCvWrapper } from 'context/createVcCv_state'
import { SourcesWrapper } from 'context/sources_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IVacancy } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { CookiesType } from 'types/enums'

interface Query {
  id?: string
  progress?: number
}
interface Props extends Query {
  vacancy: IVacancy
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const { id } = context.query  
  const token = context.req.cookies[CookiesType.accessToken]
  const profileType = context.req.cookies[CookiesType.profileType]
  const progress = Number(context.query.progress)
  if(profileType === ProfileType.Employee && token) {
    return {redirect: {destination: '/create/cv', permanent: false} }
  }
  if(profileType && token && id) {
    try {
      const vacancy = await VacancyRepository.getVacancyById(Number(id), profileType, token).then(res=> res)
      .catch(err => console.warn(err))
      return {props: {vacancy, id, progress}}
    }
    catch (err) {
      return {redirect: {destination: '/create/vacancy', permanent: false} }
    }
  }
  else if(profileType && token && !id) {
    return {props: {}}
  }
  else {
    return {
      redirect: {destination: '/login', permanent: false}   
    }
  }
}) 

interface Props {
}
export default function VacancyCreate(props: Props) {

  return  (
    <ContentLayout hideMobileHeader title={'Редактирование Вакансии'}>
      <CreateVcCvWrapper progress={props?.progress}>
        <SourcesWrapper>
          <Vacancy id={Number(props?.id) as number} vacancy={props?.vacancy}/>
        </SourcesWrapper>
      </CreateVcCvWrapper>
    </ContentLayout>
  )

}