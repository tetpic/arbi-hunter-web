import Messenger from 'components/for_pages/messenger'
import { ChatSocketWrapper } from 'context/chat_socket_state'
import { ChatWrapper } from 'context/chat_state'
import IChat from 'data/interfaces/IChat'
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


export default function MessengerPage(props: Props) {
  return <ChatSocketWrapper>
    <ChatWrapper>
      <Messenger chats={props.chats}/>
    </ChatWrapper>
  </ChatSocketWrapper>
}