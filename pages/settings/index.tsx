import SettingsPage from '@/components/for_pages/settings'
import ContentLayout from '@/components/layout/ContentLayout'

interface Props {
}

export default function Settings(props: Props) {

  return (
    <ContentLayout hideMobileHeader title='Настройки'>
      <SettingsPage/>
    </ContentLayout>
  )
}