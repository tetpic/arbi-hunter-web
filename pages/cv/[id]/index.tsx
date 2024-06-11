import CvPage from 'components/for_pages/cv'
import ContentLayout from 'components/layout/ContentLayout'
import { FavoritesFolderWrapper } from 'context/favorites_folder_state'
import { PersonalWrapper } from 'context/personal_state'
import { VacancyWrapper } from 'context/vacancy_state'
import { ICV } from 'data/interfaces/ICV'
import { ProfileType } from 'data/interfaces/IRegistration'
import CvRepository from 'data/repositories/CvRepository'
import { NextSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import { CookiesType } from 'types/enums'
import { TranslateLanguage, TranslateLanguageKnowLevel } from 'utils/enumsTranslations'
import Formatter from 'utils/formatter'
import { getSalary } from 'utils/getSalary'

interface Query {
  id: string
}

interface Props extends Query {
  cv?: ICV
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]

  const cvId  = Number(context.query.id)
  // if(cvId === 0 || !cvId) {
  //   return {redirect: {destination: '/', permanent: false}}
  // }
  // else if(!token) {
    // return {redirect: {destination: '/login', permanent: false}}
  // }
  // else {
    const cv = await CvRepository.getById(cvId, profileType as ProfileType).then(res => res)
    return {props: {id: cvId, cv}}
  // }

}) 



export default function Cv(props: Props) {
  const {t} = useTranslation()


  return (
    <>
     <NextSeo
        title={'ArbiHunter | Резюме ' + props.cv?.categories[0].name}
        description={`Резюме ${props.cv.categories[0].name}`+' Зарплата: ' + getSalary({cv: props.cv}, t)}
        openGraph={{
          type: 'website',
          url: `${process.env.host}/cv/${props.cv.id}`,
          title: 'ArbiHunter | Резюме ' +  props.cv.categories[0].name,
          description: `Зарплата:  ${getSalary({cv: props.cv}, t)}, Опыт работы: ${Formatter.fullTimeLine(props.cv.experienceInfo?.map(el=> [el.fromDate, el.toDate]))}, Знание языков: ${props.cv.languageKnowledges.map(el=>({name: TranslateLanguage(el.language, t) + ' - ' + TranslateLanguageKnowLevel(el.level, true)})).map(el => el.name).join(', ')}`,
          images: [
            {
              url: `${process.env.host}/api/share-image/cv/${props.cv.id}`,
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
  
  <ContentLayout title='Резюме' hideMobileHeader>
    <PersonalWrapper key={'cv_page'+props.id}>
      <VacancyWrapper>
        <FavoritesFolderWrapper>
        <CvPage cvId={props.id}/>
        </FavoritesFolderWrapper>
      </VacancyWrapper>
    </PersonalWrapper> 
  </ContentLayout>
    </>
  )
}