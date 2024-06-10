import VacancyPage from 'components/for_pages/vacancy'
import ContentLayout from 'components/layout/ContentLayout'
import { PersonalWrapper } from 'context/personal_state'
import { VacancyWrapper } from 'context/vacancy_state'
import { IVacancy } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import useTranslation from 'next-translate/useTranslation'
import { NextSeo} from 'next-seo'
import { getSalary } from 'utils/helpers'
import { TranslateEmploymentType, TranslateWorkExperience } from 'utils/enumsTranslations'


interface Query {
  id: string
  vacancy: IVacancy
}

interface Props extends Query {
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const id  = Number(context.query.id)
  // const profileType = context.req.cookies[CookiesType.profileType]
  // const token = context.req.cookies[CookiesType.accessToken]


  if(id === 0 || !id) {
    return {redirect: {destination: '/', permanent: false}}
  }
  const vacancy = await VacancyRepository.getVacancyById(id)
  return {props: {id, vacancy}}
}) 

export default function Vacancy(props: Props) {
  const {t} = useTranslation()

  return (<>
   <NextSeo
        title={'ArbiHunter | Вакансия ' + props.vacancy.name}
        description={'Зарплата: ' + getSalary({vacancy: props.vacancy}, t)}
        openGraph={{
          type: 'website',
          url: `${process.env.host}/vacancy/${props.vacancy.id}`,
          title: 'ArbiHunter | ' + props.vacancy.name + ` | работа в компании ${props.vacancy.company}`,
          description: 'Зарплата: ' 
          + getSalary({vacancy: props.vacancy}, t) 
          + `. Требуемый опыт: ${props.vacancy.experience?TranslateWorkExperience(props.vacancy.experience, t).toLowerCase() + ' лет': 'не требуется'}. 
          Занятость: ${TranslateEmploymentType(props.vacancy.employment, t)}. ${props.vacancy.isRemote?'Удаленно. ':'Oфис. '}
          Работа в компании ${props.vacancy.company}.`,
          images: [
            {
              url: `${process.env.host}/api/share-image/vacancy/${props.vacancy.id}`,
              width: 1200,
              height: 630,
              type: 'image/png',
            },
          ],
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />

  <ContentLayout hideMobileHeader>
    <PersonalWrapper key={'vacancy_page'+props.id}>
      <VacancyWrapper>
        <VacancyPage id={Number(props.id)}/>
      </VacancyWrapper>
    </PersonalWrapper>
  </ContentLayout>
  </>
  )
}