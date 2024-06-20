import styles from './index.module.scss'

import Image, { StaticImageData } from 'next/image'
import qrCode from 'images/footer/qrCode.svg'
import check from 'images/recruiting/check.svg'
import cross from 'images/recruiting/recruiting_cross.svg'
import appleIcon from 'images/recruiting/recruiting_apple.png'
import googleIcon from 'images/recruiting/recruiting_gplay.png'
import phone from 'images/recruiting/recruiting_mobile.png'
import Button from 'components/ui/Button'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  cards: string[]|StaticImageData[]
}



export default function AppPromo(props: Props) {
  const {t} = useTranslation()
  const cardsRef = useRef<HTMLImageElement[]>([])
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light
  const {isTabletWidth} = appContext.size
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
    <div className={classNames(styles.left, isLightTheme&&styles.left_light) }>
      <P styleType={['w700', 'huge']} useThemeColor className={styles.title}>
        {t('landing_promo_intro')}
      </P>
      <P styleType={['w500', 'large']} useThemeColor className={styles.desc}>
        {t('landing_promo_desc')}
      </P>
      <div className={styles.buttonsWrapper}>
        <Button styleType={['grey', 'whiteText']} altStyleType={['whitePurple']} href={'https://apps.apple.com/us/app/arbihunter/id6478117103'} className={styles.button}>
          <Image src={appleIcon} alt={'apple icon'} width={20} height={20}/>
          <P styleType={['w600', 'large']} useThemeColor>Download Now</P>
        </Button>
        <Button styleType={['grey', 'whiteText']} altStyleType={['whitePurple']} href={'https://play.google.com/store/apps/details?id=com.arbi.hunter'} className={styles.button}>
          <Image src={googleIcon} alt={'google play icon'}/>
          <P styleType={['w600', 'large']} useThemeColor>Download Now</P>
        </Button>
      </div>
      <div className={styles.mobile}>
        <Image className={styles.back} src={phone} alt={'phone image'} width={306} height={420}/>
        <div className={styles.cards}>
          {props.cards.map((el, index)=> {
            return <Image 
            key={index}
            ref={(r)=> cardsRef.current[index] = r} 
            className={classNames(styles.img, activeCard === cardsRef.current[index]&&styles.active)} 
            src={el} 
            alt={index.toString()} 
            width={160} 
            height={280}/>
          })}
        </div>
        <div className={styles.buttons}>
          <Button className={styles.button} onClick={()=>translateCard('check')}><Image src={check} alt={'check'}/></Button>
          <Button className={styles.button} onClick={()=>translateCard('cross')}><Image src={cross} alt={'cross'}/></Button>
        </div>
      </div>
    </div>

    {!isTabletWidth &&
      <div className={classNames(styles.right, isLightTheme&&styles.right_light)}>
        <P styleType={['large', 'w600']} useThemeColor >{t('landing_promo_download')}</P>
        <P styleType={['small']} useThemeColor >{t('landing_promo_scan')}</P>
        <div className={classNames(styles.imageWrapper, isLightTheme&&styles.imageWrapper_light)}>
          <Image src={qrCode} alt={'qr code'} width={150} height={150}/>
        </div>
      </div>
    } 
  </div>)
}