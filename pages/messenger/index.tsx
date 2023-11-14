import Messenger from 'components/for_pages/messenger'
import { ChatSocketWrapper } from 'context/chat_socket_state'
import { ChatWrapper } from 'context/chat_state'
import { CookiesType } from 'types/enums'

interface Query {
  chat: string|null
}


 

export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
  const token = context.req.cookies[CookiesType.accessToken]
  if(token) {
    return {props: {chat: context?.query?.chat||null}}
  }
  else {
    return {redirect: {destination: '/login', permanent: false} }
  }
}) 


export default function MessengerPage(props: Query) {
  
  return <ChatSocketWrapper>
    <ChatWrapper initialChat={Number(props.chat)}>
      <Messenger/>
    </ChatWrapper>
  </ChatSocketWrapper>
}