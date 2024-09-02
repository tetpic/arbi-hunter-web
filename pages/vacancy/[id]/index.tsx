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
import P from '@/components/ui/P'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/user_state'
import { useEffect } from 'react'
import { CookiesType } from 'types/enums'
import { CvWrapper } from 'context/cv_state'


interface Query {
  id: string
  vacancy: IVacancy
}

interface Props extends Query {
  isAuthed?: boolean
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const id  = Number(context.query.id)
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]


  if(id === 0 || !id) {
    return {redirect: {destination: '/', permanent: false}}
  }
  const vacancy = await VacancyRepository.getVacancyById(id, profileType, token).catch(err =>null)
  return {props: {id, vacancy, isAuthed: Boolean(token)}}
}) 

export default function Vacancy(props: Props) {
  const {t} = useTranslation()
  const router = useRouter()
  const userContext = useUserContext()

  useEffect(()=>{
    if(!props.vacancy && !userContext.isLogged) {
      setTimeout(() => {
        router.push('/')
      }, 4000)
    }
  }, [])

  return (<>
  {props.vacancy &&
    <NextSeo
      title={`ArbiHunter | ${t('vacancy')} ` + props.vacancy.name}
      description={`${t('salary')}: ` + getSalary({vacancy: props.vacancy}, t)}
      openGraph={{
        type: 'website',
        url: `${process.env.HOST_ROOT}/vacancy/${props.vacancy.id}`,
        title: 'ArbiHunter | ' + props.vacancy.name + ` | ${t('workInCompany')} ${props.vacancy.company}`,
        description: `${t('salary')}: ` 
        + getSalary({vacancy: props.vacancy}, t) 
        + `. ${t('workExperienceNeeded')}: ${props.vacancy.experience?TranslateWorkExperience(props.vacancy.experience, t).toLowerCase() + ` ${t('year3')}` : t('notNeeded')}. ${t('employment')}: ${TranslateEmploymentType(props.vacancy.employment, t)}. ${props.vacancy.isRemote?`${t('remote')}. `:`${t('office')}. `} ${t('workInCompany')} ${props.vacancy.company}.`,
        images: [
          {
            url: `${process.env.HOST_ROOT}/api/share-image/vacancy/${props.vacancy.id}`,
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
  }

  <ContentLayout hideMobileHeader>
    <PersonalWrapper key={'vacancy_page'+props.id}>
      <VacancyWrapper vacancy={props.vacancy}>
        <CvWrapper>

        {props.vacancy &&
          <VacancyPage id={Number(props.id)} isAuthed={props.isAuthed}/>
          ||
          <P styleType={['textCenter']} style={{paddingBlock: '100px'}}>{t('vacancy_page_removedOrHidden')}</P>
        }
        </CvWrapper>
      </VacancyWrapper>
    </PersonalWrapper>
  </ContentLayout>
  </>
  )
}