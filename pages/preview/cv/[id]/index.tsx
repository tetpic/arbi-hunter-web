import CvPreview from '@/components/for_pages/preview/cv'
import ContentLayout from '@/components/layout/ContentLayout'
import { CvWrapper } from 'context/cv_state'
import { ICV } from 'data/interfaces/ICV'
import CvRepository from 'data/repositories/CvRepository'
import UserRepository from 'data/repositories/UserRepository'
import { CookiesType } from 'types/enums'




interface Query {
  id: number
  cv?: ICV
}

interface Props extends Query {}

export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
  const token = context.req.cookies[CookiesType.accessToken]||null
  const profile = context.req.cookies[CookiesType.profileType]||null
  const id = context.query?.id
  const cv = await CvRepository.getById(id)
  const user = await UserRepository.getCurrentUser(token)
  if(profile && token && cv && user.profiles[0].id === cv.profile.id) {
    return {props: {id: Number(id), cv: cv}}
  }
  else {
    return {redirect: {destination: '/'}}
  }
}) 

export default function CvPreviewPage(props: Props) {

  return (
    <ContentLayout withFooter>
        <CvWrapper cv={props.cv}>
          <CvPreview id={props.id}/>
        </CvWrapper>
    </ContentLayout>
  )
}