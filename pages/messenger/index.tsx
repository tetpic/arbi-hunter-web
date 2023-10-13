import Messenger from 'components/for_pages/messenger'
import { IChat } from 'data/interfaces/Common'
import ChatRepository from 'data/repositories/ChatRepository'
import { CookiesType } from 'types/enums'

interface Props {
  chats: IChat[]
  // contacts: any
}

export const getServerSideProps = (async (context: {/* query: Query, */ req: { cookies: { [x: string]: any } } }) => {
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  if(profileType && token) {
    const chats = await ChatRepository.getChatList({}, profileType, token)
    // const contactList = await ChatRepository.getContactList(profileType, token)
    return {props: {chats: chats.data, /* contacts: contactList */}}
  }
  else {
    return {redirect: {destination: '/login', permanent: false} }
  }
}) 

// useEffect(()=>{
//   ChatRepository.getChatList({}, ProfileType.Hirer)
// }, [])

export default function MessengerPage(props: Props) {
  
  

  return <Messenger chats={props.chats}/>
}