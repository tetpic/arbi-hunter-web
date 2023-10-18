import Button from 'components/ui/Button'
import SettingsThreeSlidersSvg from 'components/svg/SettingsThreeSlidersSvg'
import classNames from 'classnames'

import styles from './index.module.scss'

interface Props {
  className?: string
}

export default function SearchBar(props: Props) {

  return (<div className={classNames(styles.root, props.className)}>
    <input className={styles.input} type="text" placeholder='Найти статью или сообщество' /> 
    <Button title='filter search button' className={styles.filterButton}><SettingsThreeSlidersSvg/> </Button>
    <Button className={styles.button}>Найти</Button>
  </div>)
}