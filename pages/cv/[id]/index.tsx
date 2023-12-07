// import { CookiesType } from 'types/enums';

import CvPage from 'components/for_pages/cv'
import ContentLayout from 'components/layout/ContentLayout'

interface Query {
  id: string
}

interface Props extends Query {
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const id  = Number(context.query.id)
  // const profileType = context.req.cookies[CookiesType.profileType]
  // const token = context.req.cookies[CookiesType.accessToken]
  return {props: {id}}
}) 



export default function Cv(props: Props) {

  return (<ContentLayout title='Резюме'>
    <CvPage id={props.id}/>
  </ContentLayout>)
}