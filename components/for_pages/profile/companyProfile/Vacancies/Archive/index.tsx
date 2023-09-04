import styles from './index.module.scss'

interface Props {
}

interface ItemProps {

}

function Item(props: ItemProps) {
  return (
    <div className={styles.item}>

    </div>
  )
}

export default function VacanciesArchive(props: Props) {

  return (<div className={styles.root}> 
    <Item/>
    <Item/>
    <Item/>
  </div>)
}