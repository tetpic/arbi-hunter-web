import ErrorBoundary from '@/components/ui/ErrorBoundary'
import Messenger from 'components/for_pages/messenger'
import { ChatSocketWrapper } from 'context/chat_socket_state'
import { ChatWrapper } from 'context/chat_state'
import { FeedbacksWrapper } from 'context/feedbacks_state'
import IChat from 'data/interfaces/IChat'
import ChatRepository from 'data/repositories/ChatRepository'
import { CookiesType } from 'types/enums'

interface Query {
  chat: string|null
}

interface Props extends Query {
  chats: IChat[]
}


 

export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
  const token = context.req.cookies[CookiesType.accessToken]
  const profileType = context.req.cookies[CookiesType.profileType]

  if(token) {
    const chats = await ChatRepository.getChatList({limit: 20}, null, token, profileType)
    return {props: {chat: context?.query?.chat||null, chats: chats.data} as Props} 
  }
  else {
    return {redirect: {destination: '/login', permanent: false} }
  }
}) 


export default function MessengerPage(props: Props) {
  
  return (
    <ErrorBoundary href={'/messenger'}>
      <FeedbacksWrapper>
        <ChatSocketWrapper>
          <ChatWrapper initialChat={Number(props.chat)} chatList={props.chats}>
            <Messenger chat={Number(props.chat)}/>
          </ChatWrapper>
        </ChatSocketWrapper>
      </FeedbacksWrapper>
    </ErrorBoundary>
  )
}