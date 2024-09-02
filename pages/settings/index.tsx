import SettingsPage from '@/components/for_pages/settings'
import ContentLayout from '@/components/layout/ContentLayout'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

export default function Settings(props: Props) {
  const {t} = useTranslation()

  return (
    <ContentLayout hideMobileHeader title={t('settings')}>
      <SettingsPage/>
    </ContentLayout>
  )
}