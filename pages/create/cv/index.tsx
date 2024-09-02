import Cv from 'components/for_pages/create/Cv'
import ContentLayout from 'components/layout/ContentLayout'
import { CreateVcCvWrapper } from 'context/createVcCv_state'
import { SourcesWrapper } from 'context/sources_state'
import { ICV } from 'data/interfaces/ICV'
import { ProfileType } from 'data/interfaces/IRegistration'
import CvRepository from 'data/repositories/CvRepository'
import useTranslation from 'next-translate/useTranslation'
import { CookiesType } from 'types/enums'

interface Query {
  id?: string
  progress?: number
}
interface Props extends Query {
  cv: ICV
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const { id } = context.query  
  const token = context.req.cookies[CookiesType.accessToken]
  const profileType = context.req.cookies[CookiesType.profileType]
  const progress = Number(context.query.progress)
  if(profileType === ProfileType.Hirer && token) {
    return {redirect: {destination: '/create/vacancy', permanent: false} }
  }
  if(profileType && token && id) {
    const cv = await CvRepository.getById(Number(id), profileType, token).then(res=> res)
    return {props: {cv, id, progress}}
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


export default function CvCreate(props: Props) {
  const {t} = useTranslation()
  
  return (
    <ContentLayout hideMobileHeader title={t('editCv')}>
      <CreateVcCvWrapper progress={props.progress}>
        <SourcesWrapper>
          <Cv id={Number(props.id) as number} cv={props.cv}/>
        </SourcesWrapper>
      </CreateVcCvWrapper>
    </ContentLayout>
  )
}