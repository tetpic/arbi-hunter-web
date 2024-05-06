import SettingCodeSvg from '@/components/svg/SettingCodeSvg'
import styles from './index.module.scss'
import P from '../P'
import Button from '../Button'

interface Props {
}

export default function Development(props: Props) {

  return (<div className={styles.root}> 
    <SettingCodeSvg/>
    <P styleType={['huge', 'w600']} useThemeColor>Страница находится в разработке</P>
    <Button href={'/'} styleType={['gradient']}>Вернуться на главную страницу</Button>

  </div>)
}