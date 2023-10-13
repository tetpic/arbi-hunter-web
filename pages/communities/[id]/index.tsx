import CommunityPage from 'components/for_pages/communities/Community'
import ContentLayout from 'components/layout/ContentLayout'
import ICommunity from 'data/interfaces/ICommunity'
import CommunitiesRepository from 'data/repositories/CommunitiesRepository'

interface Props {
  community: ICommunity
  id: number
}

interface Query {
  id: string
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const id  = Number(context.query.id)
  if(id) {
    try{
      const community = await CommunitiesRepository.getCommunityById(id)
      return {props: {community, id}}
    }
    catch(err){
      return {props: {id}}
    }
  }
}) 

export default function Community(props: Props) {

  return (
    <ContentLayout title={props.community.name.toString()}> 
      <CommunityPage community={props.community} id={props.id}/>
    </ContentLayout>
   
  )
}