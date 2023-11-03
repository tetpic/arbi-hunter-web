import styles from './index.module.scss'

import Image from 'next/image'
import leftSide_bottomRightUnit from 'images/mediaAnimation/leftSide_bottomUnit.png'
import leftSide_bottomLeftVector from 'images/mediaAnimation/leftSide_bottomVector.png'
import leftSide_topRightUnit from 'images/mediaAnimation/leftSide_topRightUnit.png'
import leftSide_topLeftUnit  from 'images/mediaAnimation/leftSide_topLeftUnit.png'
import rightSide_bottomLeftUnit from 'images/mediaAnimation/rightSide_bottomLeftUnit.png'
import rightSide_bottomRightUnit from 'images/mediaAnimation/rightSide_bottomRightUnit.png'
import rightSide_bottomVector from 'images/mediaAnimation/rightSide_bottomVector.png'
import rightSide_centerUnit from 'images/mediaAnimation/rightSide_centerUnit.png'
import rightSide_centerVector from 'images/mediaAnimation/rightSide_centerVector.png'
import rightSide_topLeftUnit from 'images/mediaAnimation/rightSide_topLeftUnit.png'
import rightSide_topLeftVector from 'images/mediaAnimation/rightSide_topLeftVector.png'
import rightSide_topRightUnit from 'images/mediaAnimation/rightSide_topRightUnit.png'
import mediaLandingImageMobile from 'images/mediaLandingImageMobile.png'

import Link from 'next/link'
import { useResize } from 'components/hooks/useResize'
import anime from 'animejs'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'



interface Props {
  isMobile?: boolean
}

interface ImagesAnimate {
  ls_bru: HTMLImageElement,
  ls_blv: HTMLImageElement,
  ls_tru: HTMLImageElement,
  ls_tlu: HTMLImageElement,

  ls_bruW: HTMLDivElement,
  ls_blvW: HTMLDivElement,
  ls_truW: HTMLDivElement,
  ls_tluW: HTMLDivElement,

  rs_blu: HTMLImageElement,
  rs_bru: HTMLImageElement,
  rs_bv: HTMLImageElement,
  rs_cu: HTMLImageElement,
  rs_cv: HTMLImageElement,
  rs_tlu: HTMLImageElement,
  rs_tlv: HTMLImageElement,
  rs_tru: HTMLImageElement,

  rs_bluW: HTMLDivElement,
  rs_bruW: HTMLDivElement,
  rs_bvW: HTMLDivElement,
  rs_cuW: HTMLDivElement,
  rs_cvW: HTMLDivElement,
  rs_tluW: HTMLDivElement,
  rs_tlvW: HTMLDivElement,
  rs_truW: HTMLDivElement,
}

export default function MediaPageHeader(props: Props) {
  const {isTabletWidth} = useResize()
  const animationRotateRef = useRef<ReturnType<typeof anime>>(null!)
  const animationSlideRef = useRef<ReturnType<typeof anime>>(null!)
  const imagesRef = useRef<Partial<ImagesAnimate>>({})
  const [rotation, setRotation] = useState<number>(0)
  const [slide, setSlide] = useState<number>(0)
  const [isActive, setActive] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)


  useEffect(()=>{
    if(!isActive) return 
    const tlRotate = anime.timeline({
      easing: 'linear',
      autoplay: false,
    })
    tlRotate.add({
      targets: imagesRef.current.ls_bru,
      rotate: [0, -18]
    }, 0)
    .add({
      targets: imagesRef.current.ls_tru,
      rotate: [0, 18]
    }, 0)
    .add({
      targets: imagesRef.current.ls_tlu,
      rotate: [0, -18]
    }, 0)
    .add({
      targets: imagesRef.current.ls_tlu,
      rotate: [0, -18]
    }, 0)
    .add({
      targets: imagesRef.current.rs_blu,
      rotate: [0, -14]
    }, 0)
    .add({
      targets: imagesRef.current.rs_bru,
      rotate: [0, 14]
    }, 0)
    .add({
      targets: imagesRef.current.rs_cu,
      rotate: [0, -18]
    }, 0)
    .add({
      targets: imagesRef.current.rs_tlu,
      rotate: [0, 18]
    }, 0)
    .add({
      targets: imagesRef.current.rs_tru,
      rotate: [0, -18]
    }, 0)
    animationRotateRef.current = tlRotate

    const tlSlide = anime.timeline({
      easing: 'linear',
      autoplay: false
    })
    tlSlide.add({
      targets: imagesRef.current.ls_bruW,
      translateX: [-35, 35]
    }, 0)
    .add({
      targets: imagesRef.current.ls_truW,
      translateX: [-70, 70]
    }, 0)
    .add({
      targets: imagesRef.current.ls_tluW,
      translateX: [-40, 40]
    }, 0)
    .add({
      targets: imagesRef.current.ls_blvW,
      translateX: [-30, 30]
    }, 0)
    .add({
      targets: imagesRef.current.rs_bluW,
      translateX: [-50, 50]
    }, 0)
    .add({
      targets: imagesRef.current.rs_bruW,
      translateX: [-30, 30]
    }, 0)
    .add({
      targets: imagesRef.current.rs_bvW,
      translateX: [-35, 35]
    }, 0)
    .add({
      targets: imagesRef.current.rs_cuW,
      translateX: [-20, 20]
    }, 0)
    .add({
      targets: imagesRef.current.rs_cvW,
      translateX: [-25, 25]
    }, 0)
    .add({
      targets: imagesRef.current.rs_tluW,
      translateX: [-10, 10]
    }, 0)
    .add({
      targets: imagesRef.current.rs_tlvW,
      translateX: [-15, 15]
    }, 0)
    .add({
      targets: imagesRef.current.rs_truW,
      translateX: [-30, 30]
    }, 0)
    animationSlideRef.current = tlSlide


    window.addEventListener('scroll', (e)=> {
      const scrolled = window.scrollY
      setRotation(scrolled <= 300?((~~scrolled/3)*10):1000)
    })
    document.addEventListener('mousemove', (e) => {
      const moved = e.pageX
      const width = window.innerWidth
      const percentage = moved/(width/100)
      setSlide(percentage*10)
    })
  }, [isActive])

  useEffect(()=>{
    if(!isActive) return 
    animationRotateRef.current.seek(rotation)
    animationSlideRef.current.seek(slide)
  }, [slide, rotation, isActive])

  useEffect(()=>{
    setIsLoaded(true)
    setTimeout(() => {
      setActive(true)
    }, 500)
  }, [])



  return (
  <div className={styles.header}>
    {!isTabletWidth && <>
      <div className={classNames(styles.leftImages, isLoaded&&styles.active, isActive&&styles.noTransition)}>
        <div ref={r=> imagesRef.current.ls_blvW = r}>
          <Image  ref={r=> imagesRef.current.ls_blv = r} src={leftSide_bottomLeftVector} alt='' width={225} height={200}/>
        </div>
        <div ref={r=> imagesRef.current.ls_bruW = r}>
          <Image style={{transformOrigin: '175px 170px'}} ref={r=> imagesRef.current.ls_bru = r} src={leftSide_bottomRightUnit} alt=''  width={225} height={200}/>
        </div>
        <div ref={r=> imagesRef.current.ls_truW = r}>
          <Image style={{transformOrigin: '180px 40px'}} ref={r=> imagesRef.current.ls_tru = r} src={leftSide_topRightUnit} alt=''  width={225} height={200}/>
        </div>
        <div ref={r=> imagesRef.current.ls_tluW = r}>
          <Image  style={{transformOrigin: '40px 60px'}} ref={r=> imagesRef.current.ls_tlu = r} src={leftSide_topLeftUnit} alt=''  width={225} height={200}/>
        </div>
      </div>
      <div className={classNames(styles.rightImages, isLoaded&&styles.active, isActive&&styles.noTransition)}>
        <div ref={r=> imagesRef.current.rs_truW = r}>
          <Image style={{transformOrigin: '260px 90px'}}  ref={r=> imagesRef.current.rs_tru = r} src={rightSide_topRightUnit} alt=''  width={283} height={287}/>
        </div>
        <div ref={r=> imagesRef.current.rs_tluW = r}>
          <Image style={{transformOrigin: '80px 30px'}}   ref={r=> imagesRef.current.rs_tlu = r} src={rightSide_topLeftUnit} alt=''  width={283} height={287}/>
        </div>
        <div ref={r=> imagesRef.current.rs_tlvW = r}>
          <Image  ref={r=> imagesRef.current.rs_tlv = r} src={rightSide_topLeftVector} alt=''  width={283} height={287}/>
        </div>
        <div ref={r=> imagesRef.current.rs_cuW = r}>
          <Image style={{transformOrigin: '130px 130px'}}  ref={r=> imagesRef.current.rs_cu = r} src={rightSide_centerUnit} alt=''  width={283} height={287}/>
        </div>
        <div ref={r=> imagesRef.current.rs_cvW = r}>
          <Image  ref={r=> imagesRef.current.rs_cv = r} src={rightSide_centerVector} alt=''  width={283} height={287}/>
        </div>
        <div ref={r=> imagesRef.current.rs_bluW = r}>
          <Image style={{transformOrigin: '55px 220px'}}   ref={r=> imagesRef.current.rs_blu = r} src={rightSide_bottomLeftUnit} alt=''  width={283} height={287}/>
        </div>
        <div ref={r=> imagesRef.current.rs_bruW = r}>
          <Image style={{transformOrigin: '160px 210px'}}   ref={r=> imagesRef.current.rs_bru = r} src={rightSide_bottomRightUnit} alt=''  width={283} height={287}/>
        </div>
        <div ref={r=> imagesRef.current.rs_bvW = r}>
          <Image   ref={r=> imagesRef.current.rs_bv = r} src={rightSide_bottomVector} alt=''  width={283} height={287}/>
        </div>
      </div>
    </>
    ||
    <Image src={mediaLandingImageMobile} alt='' width={307} height={222}/>
    }
   
    <div className={styles.content}>
      <h1 className={styles.title}>Присоединяйся к комьюнити <br /> <span className={styles.title_purple}>Arbi</span> <span className={styles.title_white}>Hunter</span></h1>
      <p className={styles.text}>Зарегистрируйся и получи доступ к подпискам на сообщества, сохраняйте статьи, подписывайтесь на новости</p>
    </div>
    <Link className={styles.registerButton} href={'/registration'}><span>Зарегистрироваться</span></Link>
  </div>)
}