import P, { ParagraphStyleType } from '@/components/ui/P'
import styles from './index.module.scss'
import Button from '@/components/ui/Button'
import classNames from 'classnames'
import Image from 'next/image'
import wallet from 'images/recruiting/recruitingCatWallet.png'
import SwiperList from '@/components/ui/SwiperList'

interface Props {
}

export default function CvVcCompilation(props: Props) {

  const paragraphTitleStyle:ParagraphStyleType[] = ['large', 'white', 'w600']
  

  return (<div className={styles.root}> 
  <SwiperList slideClassName={styles.slide} swiperProps={{spaceBetween:16, loop: false}} swiperClassname={styles.swiper}>
    <div className={styles.item}>
      <div className={classNames(styles.card, styles.card_purple )}>
        <P styleType={paragraphTitleStyle}>SMM</P>
        <P styleType={['small']}>Более 500 вакансий профессии SMM</P>
        <Button styleType={['whiteTransparent']} className={styles.button}>Смотреть все</Button>
        <Image className={styles.image} src={wallet} alt={'wallet'}/>
      </div>
      <div className={classNames(styles.card, styles.card_green )}>
        <P styleType={paragraphTitleStyle}>Финансы</P>
        <P styleType={['small']}>Более 500 вакансий профессии SMM</P>
        <Button styleType={['whiteTransparent']} className={styles.button}>Смотреть все</Button>
        <Image className={styles.image} src={wallet} alt={'wallet'}/>
      </div>
    </div>
    <div className={styles.item}>
      <div className={classNames(styles.card, styles.card_green )}>
        <P styleType={paragraphTitleStyle}>Финансы</P>
        <P styleType={['small']}>Более 500 вакансий профессии SMM</P>
        <Button styleType={['whiteTransparent']} className={styles.button}>Смотреть все</Button>
        <Image className={styles.image} src={wallet} alt={'wallet'}/>
      </div>
      <div className={classNames(styles.card, styles.card_red )}>
        <P styleType={paragraphTitleStyle}>Game dev</P>
        <P styleType={['small']}>Более 500 вакансий профессии SMM</P>
        <Button styleType={['whiteTransparent']} className={styles.button}>Смотреть все</Button>
        <Image className={styles.image} src={wallet} alt={'wallet'}/>
      </div>
    </div>
    <div className={styles.item}>
      <div className={classNames(styles.card, styles.card_orange )}>
        <P styleType={paragraphTitleStyle}>Финансы</P>
        <P styleType={['small']}>30-дневный курс от профессора НИУ ВШЭ</P>
        <Button styleType={['whiteTransparent']} className={styles.button}>Смотреть все</Button>
        <Image className={styles.image} src={wallet} alt={'wallet'}/>
      </div>
      <div className={styles.card}>
        <P styleType={paragraphTitleStyle}>SMM</P>
        <P styleType={['small']}>30-дневный курс от профессора НИУ ВШЭ</P>
        <Button styleType={['whiteTransparent']} className={styles.button}>Смотреть все</Button>
        <Image className={styles.image} src={wallet} alt={'wallet'}/>
      </div>
    </div>
  </SwiperList>


  </div>)
}