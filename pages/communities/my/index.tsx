import CommunityPage from 'components/for_pages/communities/Community'
import ICommunity from 'data/interfaces/ICommunity'
import CommunitiesRepository from 'data/repositories/CommunitiesRepository'
import Head from 'next/head'
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

  return (<>
    <Head>
        <title>{'Arbi Hunter|' + props.community?.name?.toString()}</title>
        <meta name='description' content={props?.community?.name?.toString()}/>
    </Head>
    <div> 
      <CommunityPage community={props.community} id={props.community.id}/>
    </div>
  </>)
}