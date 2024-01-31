import Vacancy from 'components/for_pages/create/Vacancy'
import ContentLayout from 'components/layout/ContentLayout'
import { CreateVcCvWrapper } from 'context/createVcCv_state'
import { IVacancy } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { CookiesType } from 'types/enums'

interface Query {
  id?: string
}
interface Props extends Query {
  vacancy: IVacancy
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const { id } = context.query  
  const token = context.req.cookies[CookiesType.accessToken]
  const profileType = context.req.cookies[CookiesType.profileType]
  if(profileType && token && id) {
    try {
      const vacancy = await VacancyRepository.getVacancyById(Number(id), profileType, token).then(res=> res)
      return {props: {vacancy, id}}
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
      <CreateVcCvWrapper>
        <Vacancy id={Number(props.id) as number} vacancy={props.vacancy}/>
      </CreateVcCvWrapper>
    </ContentLayout>
  )

}