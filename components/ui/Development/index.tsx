import SettingCodeSvg from '@/components/svg/SettingCodeSvg'
import styles from './index.module.scss'
import P from '../P'
import Button from '../Button'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

export default function Development(props: Props) {
  const {t} = useTranslation()

  return (<div className={styles.root}> 
    <SettingCodeSvg/>
    <P styleType={['huge', 'w600']} useThemeColor>{t('pageInDevelopment')}</P>
    <Button href={'/'} styleType={['gradient']}>{t('backToMainPage')}</Button>

  </div>)
}