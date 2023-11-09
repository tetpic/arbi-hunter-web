import styles from './index.module.scss'

import Button from 'components/ui/Button'
import SettingsThreeSlidersSvg from 'components/svg/SettingsThreeSlidersSvg'
import classNames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import LoupeSvg from 'components/svg/LoupeSvg'

interface Props {
  className?: string
}

export default function SearchBar(props: Props) {
  const {isTabletWidth} = useResize()

  return (
    <div className={styles.container}>
      <div className={classNames(styles.root, props.className)}>
        <input className={styles.input} type="text" placeholder='Найти статью или сообщество' /> 
        {!isTabletWidth && <>
          <Button title='filter button' className={styles.filterButton}><SettingsThreeSlidersSvg/> </Button>
          <Button title='search button' className={styles.button}>Найти</Button>
        </>
        ||
        <Button title='search button'><LoupeSvg/></Button>
      }
      </div>
    </div>
  )
}