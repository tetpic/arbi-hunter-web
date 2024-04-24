import FavoritesPageEmployee from '@/components/for_pages/favorites/FavoritesEmployee'
import FavoritesPageHirer from '@/components/for_pages/favorites/FavoritesHirer'
import ContentLayout from '@/components/layout/ContentLayout'
import { FavoritesFolderWrapper } from 'context/favorites_folder_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { CookiesType } from 'types/enums'


export const getServerSideProps = async(ctx: {req: {cookies: {[key:string]: string}}}) => {
  const token = ctx.req.cookies[CookiesType.accessToken]
  const profileType = ctx.req.cookies[CookiesType.profileType]
  if(profileType && token) {
    return {props: {profileType}}
  }
  else {
    return {redirect: {destination: '/login', permanent: false} }
  }
}


interface Props {
  profileType: ProfileType
}

export default function FavoritesPage(props: Props) {

  return (
    <ContentLayout title='Избранное'>
      {props.profileType === ProfileType.Hirer 
        ? <FavoritesFolderWrapper>
            <FavoritesPageHirer/> 
          </FavoritesFolderWrapper>
        : <FavoritesPageEmployee/>
      }

    </ContentLayout>
  )
}