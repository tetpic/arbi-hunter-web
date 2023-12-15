import styles from './index.module.scss'

import Image from 'next/image'
import tower from 'images/recruiting/tower.png'
import Button from 'components/ui/Button'
import { useCallback, useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import UserSvg from 'components/svg/UserSvg'



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
  // const [randomSource, setRandomSource] = useState<string>(sources[0])
  const animationItemRef = useRef<ReturnType<typeof anime>>(null!)
  const svgPath = useRef<SVGPathElement>(null!)
  const imageRef = useRef<HTMLImageElement>(null!)
  const [activeImage, setActiveImage] = useState<[number, string]>([0, sources[0]])
  const isLoad = useRef<boolean>(false)
  const [imgIndexes, setImgIndexes] = useState<[number, number, number, number]>([1,2,3,4])
  const [counter, setCounter] = useState<number>(-1)

  useEffect(()=>{
    let isExecuted = false
    if(isExecuted || !isLoad) return
    setImgIndexes(state=> {
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
  }, [activeImage])

  const animation = useCallback(()=> {
    const path = anime.path(svgPath.current)
    const tlRotate = anime.timeline({
      easing: 'linear',
      autoplay: true,
      loop: true,
      loopBegin: ()=> {
        setCounter(state=> state>6?0:state+1)
        setTimeout(
          ()=>{
            setActiveImage(state => {
              if(state[0] === 7) {
                return [0, sources[0]]
              }
              else {
                return [state[0]+1, sources[state[0]]]
              }
            })
        }, 1000)
      }
    })
    .add({
      targets: imageRef.current,
      translateX: path('x'),
      translateY: path('y'),
      rotate: path('angle'),
      scale: [0.6, 1, 0.2],
      duration: 2030,
    }, 0)
    .add({
      targets: imageRef.current,
      opacity: [0, 1],
      
      duration: 200,
    }, 1050)
   
   .add({
      targets: imageRef.current,
      opacity: [1, 0],
      duration: 250,
    }, 1750)
    animationItemRef.current = tlRotate

  }, [])

  useEffect(()=>{
    if(!isLoad.current) {
      animation()
      isLoad.current = true
    }
  }, [])


  return (<section className={styles.head}>
    <svg style={{opacity: 0, position: 'absolute'}} width="901" height="281" viewBox="0 0 901 281" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path  ref={svgPath} d="M899.364 49.4795C902.281 63.8679 892.753 80.2319 872.609 97.5525C852.5 114.842 821.968 132.948 783.279 150.806C705.909 186.518 596.023 221.191 471.964 246.348C347.904 271.505 233.192 282.378 148.022 279.627C105.433 278.251 70.2591 273.469 45.0042 265.378C19.7037 257.273 4.55359 245.914 1.63584 231.525C-1.28191 217.137 8.24633 200.773 28.3908 183.452C48.4991 166.163 79.0316 148.057 117.721 130.199C195.091 94.4866 304.977 59.8142 429.036 34.6568C553.095 9.49943 667.807 -1.37318 752.977 1.37831C795.566 2.7542 830.74 7.53605 855.995 15.6265C881.296 23.7316 896.446 35.0911 899.364 49.4795Z" stroke="black"/>
    </svg>
    <div className={styles.resumes}>
      <div className={styles.back}>
        {sources.map((el, index)=> {
          if(index <4) return null
          return <Image className={styles[`img${index-3}`]} src={el} width={60} height={60} alt='1'/>
        })}
      </div>
      <div className={styles.front}>
      {imgIndexes.map((el, index)=> {
        return <Image  className={styles[`img${index+1}`]} src={sources[el]} width={60} height={60} alt='1'/>
      })}
      </div>
      <Image  className={styles.randomImg} ref={imageRef} src={activeImage[1]} alt='random' width={64} height={64}/>

    </div>
    <div className={styles.tower}>
      <Image  src={tower} alt={'tower'}/>
      <p className={styles.counter}><UserSvg/>  <span>000{counter}</span></p>
    </div>
    <h6 className={styles.title}>
      Разместите вакансию <br />
      <span className={styles.title_big}>
        в <span className={styles.title_purple}>Arbi</span>Hunter
      </span>
    </h6>
    <p className={styles.desc}>
      46% трудоспособного населения России — <br /> зарегистрированы на ArbiHunter
    </p>
    <Button className={styles.button}>
      <span>
        Разместить вакансию
      </span>
    </Button>
  </section>)
}