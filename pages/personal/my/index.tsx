import PersonalPage from 'components/for_pages/personal'
import ContentLayout from 'components/layout/ContentLayout'
import { PersonalWrapper } from 'context/personal_state'
import { TariffWrapper } from 'context/tariff_state'



interface Query {
  webViewOnly?: boolean
}

interface Props extends Query {
}

export const getServerSideProps = (ctx: {query: Query}) => {
  const webViewOnly = ctx?.query?.webViewOnly||null
  return {props: {webViewOnly}}
}

export default function MyCompanyPage(props: Props) {

  return (
    <ContentLayout hideMobileHeader isMobile={props.webViewOnly} withMobileMenu={props.webViewOnly?false:true}>
      <PersonalWrapper key={'my_personal_page'}>
      <TariffWrapper>
        <PersonalPage webView={props.webViewOnly}/>
      </TariffWrapper>
      </PersonalWrapper>
    </ContentLayout>
  )
}