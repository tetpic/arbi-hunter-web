import Button from 'components/ui/Button'
import SettingsThreeSlidersSvg from 'components/svg/SettingsThreeSlidersSvg'
import styles from './index.module.scss'

interface Props {
}

export default function MediaSearch(props: Props) {

  return (<div className={styles.root}>
    <input className={styles.input} type="text" placeholder='Найти статью или сообщество' /> 
    <Button title='filter search button' className={styles.filterButton}><SettingsThreeSlidersSvg/> </Button>
    <Button className={styles.button}>Найти</Button>
  </div>)
}