import Button from 'components/ui/Button'
import styles from './index.module.scss'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

export default function VacancyOptionsModal(props: Props) {
  const {t} = useTranslation()

  return (<div className={styles.root}> 
    <Button>{t('delete')}</Button>
    <Button>{t('reject')}</Button>
  </div>)
}