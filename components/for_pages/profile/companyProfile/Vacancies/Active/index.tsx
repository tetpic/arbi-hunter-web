import Button from 'components/ui/Button'
import CustomScrollbar from 'components/ui/CustomScrollbar'
import Image from 'next/image'
import styles from './index.module.scss'

interface Props {
}

interface ItemProps {

}

function Item(props:ItemProps) {
  return (
    <div className={styles.item}>
      <p className={styles.name}>Маркетолог  в компанию удаленно на постоянную основу</p>
      <p className={styles.price}><Image src={'/icons/money.png'} alt={'money icon'} width={26} height={24}/> от 350 000 ₽</p>
      <div className={styles.stats}>
        <p className={styles.stats_title}>Статистика за неделю</p>
        <div className={styles.stats_item}>
          <p className={styles.stats_desc}>Показы</p>
          <p className={styles.stats_count}>143</p>
        </div>
        <div className={styles.stats_item}>
          <p className={styles.stats_desc}>Показы</p>
          <p className={styles.stats_count}>143</p>
        </div>
        <div className={styles.stats_item}>
          <p className={styles.stats_desc}>Отклики</p>
          <p className={styles.stats_count}>1<span>+{1}</span></p>
        </div>
      </div>
      <Button  className={styles.button}>Пригласить подходящих</Button>
    </div>
  )
}

export default function VacanciesActive(props: Props) {

  return (
  <div className={styles.root}> 
    <CustomScrollbar>
      <Item/>
      <Item/>
      <Item/>
      <Item/>
    </CustomScrollbar>
  </div>)
}