import CommunityPage from 'components/for_pages/communities/Community'
import ContentLayout from 'components/layout/ContentLayout'
import ICommunity from 'data/interfaces/ICommunity'
import CommunitiesRepository from 'data/repositories/CommunitiesRepository'
import { CookiesType } from 'types/enums'

interface Props {
  community: ICommunity
}

export const getServerSideProps = (async (context: {req: { cookies: { [x: string]: any } } }) => {
  const profileType = context.req.cookies[CookiesType.profileType]

  const token = context.req.cookies[CookiesType.accessToken]
  if(profileType && token) {
    try {
      const myCommunity = await CommunitiesRepository.myCommunity(profileType, token).then(res=> res.data[0])
      return {props: {community: myCommunity}}
    }
    catch(err) {
      return {props: {}}
    }
  }

}) 


export default function MyCommunity(props: Props) {

  return (
    <ContentLayout title={props.community.name.toString()}>
      <CommunityPage community={props.community} id={props.community.id}/>
    </ContentLayout>
  )
}