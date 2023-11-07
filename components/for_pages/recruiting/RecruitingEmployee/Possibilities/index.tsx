import UserPic from 'components/ui/UserPic'
import styles from './index.module.scss'
import Image from 'next/image'
import planet from 'images/recruiting/recruiting_planet.png' //452*433
import beats from 'images/recruiting/recruiting_mock_company.png' //55*55

interface Props {
}

export default function Possibilities(props: Props) {

  return (<section className={styles.root}>
    <div className={styles.imageWrapper}>
      <Image src={planet} alt={'planet with companies'} width={452} height={433}/>
    </div>
    <div className={styles.body}>
      <p className={styles.title}>Откройте дверь в новый мир возможностей!</p>
      <div className={styles.card}>
        <UserPic image={beats} size={55}/>
      </div>
    </div>

  </section>)
}