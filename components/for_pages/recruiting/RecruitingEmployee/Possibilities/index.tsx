import styles from './index.module.scss'

import UserPic from 'components/ui/UserPic'
// import Image from 'next/image'
// import planet from 'images/recruiting/recruiting_planet.png' //452*433
import beats from 'images/recruiting/recruiting_mock_company.png' //55*55
import Button from 'components/ui/Button'
import dynamic from 'next/dynamic'
const RatingLine = dynamic(()=>import('components/ui/RatingLine'), {ssr: false})
const Planet = dynamic(()=>import('./Planet'), {ssr: false})

interface Props {
}

export default function Possibilities(props: Props) {

  return (<section className={styles.root}>
    <div className={styles.imageWrapper}>
      {/* <Image src={planet} alt={'planet with companies'} width={452} height={433}/> */}
        <Planet/>
    </div>
    <div className={styles.body}>
      <p className={styles.title}>Откройте дверь в новый мир возможностей!</p>
      <div className={styles.card}>
        <UserPic className={styles.card_pic} image={beats} size={55}/>
        <p className={styles.card_title}>Beats</p>
        <p className={styles.rating}>
          <span className={styles.rating_stats}>4,9</span>
          {/* <RatingLine rating={4}/> */}
          <span className={styles.rating_feeds}>23 отзыва</span>
        </p>
      </div>
      <p className={styles.desc}>Arbi Hunter - это уникальный инструмент для нахождения арбитражных сделок в криптовалютном рынке.</p>
      <p className={styles.desc}>Arbi Hunter - это уникальный инструмент для нахождения арбитражных сделок в криптовалютном рынке.</p>
      <Button className={styles.button}>Открыть страницу компании</Button>
    </div>

  </section>)
}