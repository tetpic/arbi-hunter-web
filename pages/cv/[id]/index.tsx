import P from '@/components/ui/P'
import CvPage from 'components/for_pages/cv'
import ContentLayout from 'components/layout/ContentLayout'
import { FavoritesFolderWrapper } from 'context/favorites_folder_state'
import { FeedbacksWrapper } from 'context/feedbacks_state'
import { PersonalWrapper } from 'context/personal_state'
import { TariffWrapper } from 'context/tariff_state'
import { VacancyWrapper } from 'context/vacancy_state'
import { ICV } from 'data/interfaces/ICV'
import { ProfileType } from 'data/interfaces/IRegistration'
import CvRepository from 'data/repositories/CvRepository'
import { NextSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
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
    const cv = await CvRepository.getById(cvId, profileType as ProfileType).then(res => res).catch(err => null)
    return {props: {id: cvId, cv}}
  // }

}) 



export default function Cv(props: Props) {
  const {t} = useTranslation()
  const router = useRouter()

  useEffect(()=>{
    if(!props.cv) {
      setTimeout(() => {
        router.push('/')
      }, 1000)
    }
  }, [props.cv])

  return (
    <>
    {props.cv &&
     <NextSeo
      title={`ArbiHunter | ${t('cv')} ` + props.cv?.categories[0].name}
      description={`${t('cv')} ${props.cv.categories[0].name}`+` ${t('salary')}: ` + getSalary({cv: props.cv}, t)}
      openGraph={{
        type: 'website',
      url: `${process.env.HOST_ROOT}/cv/${props.cv.id}`,
      title: `ArbiHunter | ${t('cv')} ` +  props.cv.categories[0].name,
      description: [
        `${t('salary')}:  ${getSalary({cv: props.cv}, t)}`,
        `${t('workExperience')}: ${Formatter.fullTimeLine(props.cv.experienceInfo?.map(el=> [el.fromDate, el.toDate]))}`,
        props.cv.languageKnowledges.length>0&&`${t('languageKnowledges')}: ${props.cv.languageKnowledges.map(el=>({name: TranslateLanguage(el.language, t) + ' - ' + TranslateLanguageKnowLevel(el.level, true)})).map(el => el.name).join(', ')}`
      ].filter(Boolean).join(', '),
      images: [
        {
          url: `${process.env.HOST_ROOT}/api/share-image/cv/${props.cv.id}`,
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
  
  <ContentLayout title={t('cv')} hideMobileHeader>
    <PersonalWrapper key={'cv_page'+props.id}>
      <FeedbacksWrapper>
        <VacancyWrapper>
          <TariffWrapper>

          <FavoritesFolderWrapper>
            {props.cv
              ? <CvPage cvId={props.id}/>
              : <P styleType={['textCenter']} style={{width: '100%', paddingBlock: '100px'}}>{t('cv_deleteOrHidden')}</P>
            }
          </FavoritesFolderWrapper>
            </TariffWrapper>
        </VacancyWrapper>
      </FeedbacksWrapper>
    </PersonalWrapper> 
  </ContentLayout>
    </>
  )
}