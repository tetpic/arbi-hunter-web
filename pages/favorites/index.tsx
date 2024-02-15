import FavoritesPage from '@/components/for_pages/favorites'
import ContentLayout from '@/components/layout/ContentLayout'

interface Props {
}

export default function Favorites(props: Props) {

  return (
    <ContentLayout title='Избранное'>
      <FavoritesPage/>
    </ContentLayout>
  )
}