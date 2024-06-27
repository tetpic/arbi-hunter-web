import FavoritesPageEmployee from '@/components/for_pages/favorites/FavoritesEmployee'
import FavoritesPageHirer from '@/components/for_pages/favorites/FavoritesHirer'
import ContentLayout from '@/components/layout/ContentLayout'
import { FavoritesFolderWrapper } from 'context/favorites_folder_state'
import { IFolder } from 'data/interfaces/IFolder'
import { ProfileType } from 'data/interfaces/IRegistration'
import FavoritesFolderRepository from 'data/repositories/FavoritesFolderRepository'
import { CookiesType } from 'types/enums'


export const getServerSideProps = async(ctx: {req: {cookies: {[key:string]: string}}}) => {
  const token = ctx.req.cookies[CookiesType.accessToken]
  const profileType = ctx.req.cookies[CookiesType.profileType]
  if(profileType && token) {
    const allFolders = await FavoritesFolderRepository.getFolderList(token, profileType as ProfileType)
    return {props: {profileType, folders: allFolders.data}}
  }
  else {
    return {redirect: {destination: '/login', permanent: false} }
  }
}


interface Props {
  profileType: ProfileType
  folders: IFolder[]
}

export default function FavoritesPage(props: Props) {

  return (
    <ContentLayout title='Избранное' hideMobileHeader withMobileMenu={props.profileType === ProfileType.Hirer }>
      {props.profileType === ProfileType.Hirer 
        ? <FavoritesFolderWrapper initialFolders={props.folders}>
            <FavoritesPageHirer/> 
          </FavoritesFolderWrapper>
        : <FavoritesPageEmployee/>
      }

    </ContentLayout>
  )
}