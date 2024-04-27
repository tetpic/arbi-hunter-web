import { CookiesType } from 'types/enums'

interface Query {
  id?: number
  chatId? : number
}


export const getServerSideProps = async (ctx: {query: Query, req: { cookies: { [x: string]: any } }}) => {
  const token = ctx.req.cookies[CookiesType.accessToken]
  const chatId = ctx.query.chatId||null
  if(token) {
    return {redirect: {destination: '/messenger?chat='+chatId,  permanent: false,} }
  }
  else {
    return {redirect: {destination: '/login', permanent: false} }
  }

}

export default function MessageId() {
  return (<></>)
}