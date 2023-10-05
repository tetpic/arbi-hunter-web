import Button from 'components/ui/Button'
import styles from './index.module.scss'
import SettingsThreeSlidersSvg from 'components/svg/SettingsThreeSlidersSvg'

interface Props {
}

export default function MediaSearch(props: Props) {

  return (<div className={styles.root}>
    <input className={styles.input} type="text" placeholder='Найти статью или сообщество' /> 
    <Button className={styles.filterButton}><SettingsThreeSlidersSvg/> </Button>
    <Button className={styles.button}>Найти</Button>
  </div>)
}