import styles from './index.module.scss'

import Image, { StaticImageData } from 'next/image'
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
  cards: string[]|StaticImageData[]
}



export default function AppPromo(props: Props) {
  const cardsRef = useRef<HTMLImageElement[]>([])
  const [activeCard, setActiveCard] = useState<HTMLImageElement>(cardsRef.current[0])

  const translateCard = (type: 'check'|'cross') => {
    const currentIndex = cardsRef.current.indexOf(activeCard)
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

      setActiveCard(currentIndex=== props.cards.length-1?cardsRef.current[0]:cardsRef.current[currentIndex+1])
    }, 300)
  }

  useEffect(()=>{
    setActiveCard(cardsRef.current[0])
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
          {props.cards.map((el, index)=> {
            return <Image 
            ref={(r)=> cardsRef.current[index] = r} 
            className={classNames(styles.img, activeCard === cardsRef.current[index]&&styles.active)} 
            src={el} 
            alt={index.toString()} 
            width={178} 
            height={300}/>
          })}
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