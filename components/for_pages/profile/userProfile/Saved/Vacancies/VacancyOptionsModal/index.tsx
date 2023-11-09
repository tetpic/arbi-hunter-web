import Button from 'components/ui/Button'
import styles from './index.module.scss'

interface Props {
}

export default function VacancyOptionsModal(props: Props) {

  return (<div className={styles.root}> 
    <Button>Удалить</Button>
    <Button>Отказаться</Button>
  </div>)
}