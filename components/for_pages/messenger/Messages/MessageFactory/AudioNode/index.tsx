import {useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import PlayButtonWhiteSvg from 'components/svg/PlayButtonWhiteSvg'
import Button from 'components/ui/Button'
import PauseButtonSvg from 'components/svg/PauseButtonSvg'
import { AudioVisualizer } from '../../../../../../node_modules/react-audio-visualize'
import P from '@/components/ui/P'
import Formatter from 'utils/formatter'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import Cookies from 'js-cookie'
import { CookiesType } from 'types/enums'

// import { buffer } from 'stream/consumers'

interface Props {
  isLoading: boolean
  audioSrc: string
}

export default function AudioNode(props: Props) {
  // const audio = useRef<HTMLAudioElement>(null!)
  const [audio, setAudio] = useState<HTMLMediaElement>(new Audio(props.audioSrc))
  audio.preload = 'metadata'
  const [play, setIsPlay] = useState<boolean>(false)
  const [blob, setBlob] = useState<Blob>()
  const timer = useRef<ReturnType<typeof setInterval>>()
  const [time, setTimeState] = useState<number>(0)
  const [duration, setDuration] = useState<number>(audio.duration)
  const visualizerRef = useRef<HTMLDivElement>(null)
  audio.crossOrigin = 'anonymous'
  const [active, setActive] = useDetectOutsideClick(visualizerRef, false)

  const playPauseHandler = () => {
    if(audio && audio.paused ) {
      setActive(true)
      audio?.play()
         
      setIsPlay(true)
      timer.current = setInterval(() => {
        setTimeState(state => {
          const _audioTime = Number(audio?.currentTime.toFixed(2))
          if(_audioTime && _audioTime > 0) {
            return _audioTime
          }
          else {
            return state + 0.1
          }
        })
      }, 100)
    }
    else {
      audio.pause()
      setIsPlay(false)
      clearInterval(timer.current)
    }
  }


useEffect(()=>{
  fetch(audio.src, {
    method: 'get',
    headers: {
      'authorization': `Bearer ${Cookies.get(CookiesType.accessToken)}`
    }
  })
  .then(response => response.blob())
  .then((b) => {
    const _audio = new Audio(URL.createObjectURL(b))
    _audio.addEventListener('loadedmetadata', () => {
      console.log(_audio.duration)
     
    })
    setBlob(b)
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.warn(err)
  })
}, [])

useEffect(()=>{
  if(audio && audio.played) {
    audio.addEventListener('ended', ()=>{
      audio.pause()
      audio.currentTime = 0
      clearInterval(timer.current)
      setTimeState(0)
      setIsPlay(false)
    })
  }
  
}, [audio])

function getDuration(event: any) {
  event.target.currentTime = 0
  audio.removeEventListener('timeupdate', getDuration)
  setDuration(event.target.duration)
}

 useEffect(()=>{ 
  audio.addEventListener('loadedmetadata', () => {
    if(!Number.isInteger(audio.duration)) {
      audio.currentTime = 100000
      audio.addEventListener('timeupdate', getDuration)
    }    
  })
 }, [audio])

 useEffect(()=>{
  if(!active ) {
    audio.pause()
    audio.currentTime = 0
    clearInterval(timer.current)
    setTimeState(0)
    setIsPlay(false)
  }
 }, [active])

  return (<div className={styles.root} ref={visualizerRef} key={'visualizer node'}> 
    <Button onClick={playPauseHandler} >
      {play &&
        <PauseButtonSvg className={styles.playSvg}/>
        ||
        <PlayButtonWhiteSvg className={styles.playSvg}/>
      }
    </Button>
    <div className={styles.audioNode}>
      
    {/* <DumbAudioWaveSvg/> */}
    <div className={styles.visualizerWrapper}>
      <AudioVisualizer 
      key={'visualizer'}
      blob={blob}
      width={188} 
      height={100} 
      barWidth={2}
      gap={2}   
      currentTime={time}
      barPlayedColor={'#2F80ED'}
      />
    </div>
    <P styleType={['greyLight']} useThemeColor>{time > 0 && Formatter.formatSecondsToTime(time) + ' / '}{Formatter.formatSecondsToTime(duration)}</P>

    </div>
    {/* <audio src={props.audioSrc} ref={audio}/> */}


  </div>)
}