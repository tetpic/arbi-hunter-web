import CommunityPage from 'components/for_pages/media/Community'
import ICommunity from 'data/interfaces/ICommunity'
import CommunitiesRepository from 'data/repositories/CommunitiesRepository'
import Head from 'next/head'

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

  return (<>
    <Head>
        <title>{'Arbi Hunter|' + props.community.name.toString()}</title>
        <meta name='description' content={props?.community?.name?.toString()}/>
    </Head>
    <div> 
      <CommunityPage community={props.community} id={props.id}/>
    </div>
  </>
  )
}