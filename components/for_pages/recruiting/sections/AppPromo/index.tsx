import styles from './index.module.scss'

import Image from 'next/image'
import slide1 from 'images/recruiting/recruiting_swipe1.png'
import slide2 from 'images/recruiting/recruiting_swipe2.png'
import qr from 'images/recruiting/recruiting_qr.svg'
import check from 'images/recruiting/recruiting_check.svg'
import cross from 'images/recruiting/recruiting_cross.svg'
import appleIcon from 'images/recruiting/recruiting_apple.png'
import googleIcon from 'images/recruiting/recruiting_gplay.png'
import phone from 'images/recruiting/recruiting_mobile.png'
import Button from 'components/ui/Button'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

interface Props {
}

enum CardsNames {
  c1, c2
}

export default function AppPromo(props: Props) {
  const cardsRef = useRef<{c1: HTMLImageElement, c2: HTMLImageElement}>({c1: null, c2: null})
  const [activeCard, setActiveCard] = useState<HTMLImageElement>(cardsRef.current.c1)

  const translateCard = (type: 'check'|'cross') => {
    activeCard.style.opacity = '0'
    if(type === 'check') {
      activeCard.style.transform = 'translateX(-100px)'
      activeCard.style.rotate = '-5deg'
    } 
    else {
      activeCard.style.transform= 'translateX(100px)'
      activeCard.style.rotate = '5deg'
    } 
    setTimeout(()=> {
      activeCard.style.opacity = null
      activeCard.style.transform = null
      activeCard.style.rotate = null

      setActiveCard(activeCard === cardsRef.current.c1?cardsRef.current.c2:cardsRef.current.c1)
    }, 300)
  }

  useEffect(()=>{
    setActiveCard(cardsRef.current.c1)
  }, [])


  return (<div className={styles.root}> 
    <div className={styles.left}>
      <p className={styles.title}>
        Безграничные возможности в приложении <span>ArbiHunter</span>
      </p>
      <p className={styles.desc}>
        Представляем новую функцию в&nbsp;мобильном приложении ArbiHunter <br/> Поиск вакансий стал еще более удобный!
      </p>
      <div className={styles.buttonsWrapper}>
        <Button className={styles.button}>
          <Image src={appleIcon} alt={'apple icon'} width={20} height={20}/>
          Download Now
        </Button>
        <Button className={styles.button}>
          <Image src={googleIcon} alt={'google play icon'}/>
          Download Now
        </Button>
      </div>
      <div className={styles.mobile}>
        <Image className={styles.back} src={phone} alt={'phone image'} width={306} height={420}/>
        <div className={styles.cards}>
          <Image ref={(r)=> cardsRef.current.c1 = r} className={classNames(styles.img, activeCard === cardsRef.current.c1&&styles.active)} src={slide1} alt={'card1'} width={187} height={315}/>
          <Image ref={(r)=> cardsRef.current.c2 = r}  className={classNames(styles.img, activeCard === cardsRef.current.c2&&styles.active)} src={slide2} alt={'card2'} width={187} height={315}/>
        </div>
        <div className={styles.buttons}>
          <Button className={styles.button} onClick={()=>translateCard('check')}><Image src={check} alt={'check'}/></Button>
          <Button className={styles.button} onClick={()=>translateCard('cross')}><Image src={cross} alt={'cross'}/></Button>
        </div>
      </div>
    </div>

    <div className={styles.right}>
      <p className={styles.title}>Скачайте приложение по&nbsp;QR коду</p>
      <p className={styles.desc}>Отсканируйте код с&nbsp;камеры своего телефона</p>
      <div className={styles.imageWrapper}>
        <Image src={qr} alt={'qr code'}/>
      </div>
    </div>
  </div>)
}