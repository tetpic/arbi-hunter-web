import CommunityPage from 'components/for_pages/media/MediaPage/Community'
import ContentLayout from 'components/layout/ContentLayout'
import { MediaWrapper } from 'context/media_state'
import ICommunity from 'data/interfaces/ICommunity'
import CommunitiesRepository from 'data/repositories/CommunitiesRepository'
import { CookiesType } from 'types/enums'

interface Props {
  community: ICommunity
  id: number
}

interface Query {
  id: string
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const id  = Number(context.query.id)
  const token = context.req.cookies[CookiesType.accessToken]

  if(id && token) {
    try{
      const community = await CommunitiesRepository.getCommunityById(id)
      return {props: {community, id}}
    }
    catch(err){
      return {props: {id}}
    }
  }
  else {
    //task 730
    return {redirect: {destination: '/login', permanent: false} }
  }
}) 

export default function Community(props: Props) {

  return (
    <ContentLayout title={props.community.name.toString()}> 
      <MediaWrapper>
        <CommunityPage community={props.community} id={props.id}/>
      </MediaWrapper>
    </ContentLayout>
   
  )
}