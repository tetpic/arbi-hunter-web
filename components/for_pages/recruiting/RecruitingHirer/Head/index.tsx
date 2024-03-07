import styles from './index.module.scss'

import Image from 'next/image'
import tower from 'images/recruiting/tower.png'
import Button from 'components/ui/Button'
import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import UserSvg from 'components/svg/UserSvg'
import { useAppContext } from 'context/state'
import classNames from 'classnames'



interface Props {
}

const sources = [
  '/images/avatars/1.png',
  '/images/avatars/2.png',
  '/images/avatars/3.png',
  '/images/avatars/4.png',
  '/images/avatars/5.png',
  '/images/avatars/6.png',
  '/images/avatars/7.png',
  '/images/avatars/8.png',
]

export default function Head(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const animationItemRef = useRef<ReturnType<typeof anime>>(null!)
  const svgPath = useRef<SVGPathElement>(null!)
  const imageRef = useRef<HTMLImageElement>(null!)
  const [activeImage, setActiveImage] = useState<[number, string]>([0, sources[0]])
  const isLoad = useRef<boolean>(false)
  const [active, setActive] = useState<boolean>(false)
  const [imgIndexes, setImgIndexes] = useState<[number, number, number, number]>([1,2,3,4])
  const [counter, setCounter] = useState<number>(-1)

  useEffect(()=>{
    let isExecuted = false
    const set = () => setImgIndexes(state=> {
      if(isExecuted) return state
      isExecuted = true
      if(activeImage[0]> 3) {
        const ind = (activeImage[0]-1<4)?3:activeImage[0]-5
        state[ind] = state[ind]<4?state[ind]+4:state[ind]-4
      }
      else {
        const ind = (activeImage[0]-1<0)?3:activeImage[0]-1
        state[ind] = state[ind]<4?state[ind]+4:state[ind]-4
      }
      return state
    }) 
    if(!isLoad.current) {
      set()
      return
    }
    setTimeout(()=> {
      set()
    }, 1000)
    
  }, [activeImage])

  const animation = ()=> {
    if(isTabletWidth) {
      return false
    }
    setActive(true)
    const path = anime.path(svgPath.current)
    const tlRotate = anime.timeline({
      easing: 'linear',
      autoplay: true,
      loop: true,
      
      duration: 2000,
      loopBegin: ()=> {
        setCounter(state=> state>6?0:state+1)
      }
    })
    .add({
      targets: imageRef.current,
      translateX: path('x'),
      translateY: path('y'),
      rotate: path('angle'),
      scale: [0.6, 1, 0.2],
      duration: 2000,
    }, 0)
    .add({
      targets: imageRef.current,
      opacity: [0, 1],
      duration: 200,
      changeBegin: () => {
        setActiveImage(state => {
          if(state[0] === 7) {
            return [0, sources[0]]
          }
          else {
            return [state[0]+1, sources[state[0]]]
          }
        })
      }
    }, 1050)
   .add({
      targets: imageRef.current,
      opacity: [1, 0],
      duration: 250,
    }, 1750)
    animationItemRef.current = tlRotate
  }


  useEffect(()=>{
    if(!isLoad.current) {
      animation()
      isLoad.current = true
    }
  }, [])


  return (<section className={styles.head}>
    {!isTabletWidth &&
    <>
      <svg xmlns="http://www.w3.org/2000/svg" style={{opacity: 0, position: 'absolute'}} width="822" height="168" viewBox="0 0 822 168" fill="none">
        <path ref={svgPath} d="M794.914 2.99225L795.301 3.05904C800.005 3.87085 804.314 4.61452 808.005 5.41309C811.804 6.23494 814.909 7.10718 817.101 8.15292C819.316 9.2104 820.436 10.3668 820.582 11.6767C820.731 13.0134 819.904 14.7709 817.514 17.1162C812.765 21.776 802.347 28.2802 784.126 37.6886C765.926 47.0859 740 59.353 704.294 75.5446C660.621 95.3488 621.555 105.644 578.184 116.527C575.489 117.204 572.777 117.882 570.047 118.565C528.839 128.877 483.369 140.255 426.327 161.028C414.124 165.472 396.644 167.377 375.613 167.256C354.593 167.136 330.07 164.995 303.806 161.376C251.279 154.138 191.827 140.996 139.582 126.328C87.3235 111.656 42.3234 95.4697 18.6765 82.1558C12.7656 78.8278 8.21581 75.6939 5.22356 72.8252C2.20641 69.9325 0.887442 67.4202 1.15026 65.3237C1.40923 63.2578 3.24804 61.3252 7.2741 59.6916C11.2751 58.0683 17.2829 56.8075 25.5475 55.9948C86.4502 50.0055 121.615 60.6108 152.862 74.2076C159.207 76.9686 165.396 79.8563 171.611 82.7556C196.01 94.1393 220.796 105.703 256.933 110.495C317.656 118.547 362.492 120.786 412.151 113.066C461.799 105.349 516.24 87.6815 596.183 55.9643C609.557 50.6583 622.953 44.6221 636.455 38.5384C638.762 37.4989 641.072 36.4581 643.386 35.4193C659.245 28.298 675.274 21.2691 691.634 15.4119C724.352 3.69839 758.363 -3.31709 794.914 2.99225Z" stroke="black"/>
      </svg>
 
      <div className={styles.resumes}>
        <div className={styles.back}>
          {sources.map((el, index)=> {
            if(index <4) return null
            return <Image className={styles[`img${index-3}`]} src={el} width={60} height={60} alt='1'/>
          })}
        </div>
        <div className={classNames(styles.front, active&&styles.front_active)}>
        {imgIndexes.map((el, index)=> {          
          return  <div className={styles[`img${index+1}`]}>
          <Image className={styles.image}  src={sources[el]} width={60} height={60} alt='1'/>
          </div>
        })}
        </div>
        <Image  className={styles.randomImg} ref={imageRef} src={activeImage[1]} alt='random' width={64} height={64}/>

      </div>
      <div className={styles.tower}>
        <Image  src={tower} alt={'tower'}/>
        <div className={styles.counter}><UserSvg/> <p>000<span>{counter}</span></p></div>
      </div>
    </>}
    <h6 className={styles.title}>
      Разместите вакансию <br />
      <span className={styles.title_big}>
        в <span className={styles.title_purple}>Arbi</span>Hunter
      </span>
    </h6>
    <p className={styles.desc}>
      Огромная база кандидатов из сферы IT <br /> и маркетинга ждет вашу вакансию внутри
    </p>
    <Button styleType={['gradient']} className={styles.button} href={'/create/vacancy/'}>
        Разместить вакансию
    </Button>
  </section>)
}