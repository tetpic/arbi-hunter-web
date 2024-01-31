import Cv from 'components/for_pages/create/Cv'
import ContentLayout from 'components/layout/ContentLayout'
import { CreateVcCvWrapper } from 'context/createVcCv_state'
import { ICV } from 'data/interfaces/ICV'
import CvRepository from 'data/repositories/CvRepository'
import { CookiesType } from 'types/enums'

interface Query {
  id?: string
}
interface Props extends Query {
  cv: ICV
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const { id } = context.query  
  const token = context.req.cookies[CookiesType.accessToken]
  const profileType = context.req.cookies[CookiesType.profileType]
  if(profileType && token && id) {
    const cv = await CvRepository.getById(Number(id), profileType, token).then(res=> res)
    return {props: {cv, id}}
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
  
  return (
    <ContentLayout hideMobileHeader title={'Редактирование Резюме'}>
      <CreateVcCvWrapper>
      <Cv id={Number(props.id) as number} cv={props.cv}/>
      </CreateVcCvWrapper>
    </ContentLayout>
  )
}