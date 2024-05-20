import {useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import PlayButtonWhiteSvg from 'components/svg/PlayButtonWhiteSvg'
import Button from 'components/ui/Button'
import PauseButtonSvg from 'components/svg/PauseButtonSvg'
import { AudioVisualizer } from '../../../../../../node_modules/react-audio-visualize'

// import { buffer } from 'stream/consumers'

interface Props {
  isLoading: boolean
  audioSrc: string
}

export default function AudioNode(props: Props) {
  // const audio = useRef<HTMLAudioElement>(null!)
  const audio = useRef<HTMLMediaElement>(new Audio(props.audioSrc))
  const [play, setIsPlay] = useState<boolean>(false)
  const [blob, setBlob] = useState<Blob>()
  const timer = useRef<ReturnType<typeof setInterval>>()
  const [time, setTimeState] = useState<number>()
  const visualizerRef = useRef<HTMLCanvasElement>(null)
  audio.current.crossOrigin = 'anonymous'

  const playPauseHandler = () => {
    if(audio.current && audio.current.paused ) {
      audio.current.play()
      setIsPlay(true)
      timer.current = setInterval(() => {
        setTimeState(audio.current.currentTime)
      }, 1000)

    }
    else {
      audio.current.pause()
      setIsPlay(false)
      clearInterval(timer.current)
    }
  }

  audio.current.addEventListener('ended', ()=>{
    clearInterval(timer.current)
    setTimeState(0)
    setIsPlay(false)
  })

  /*выдает ошибку 
  Failed to execute 'createMediaElementSource' on 'AudioContext': 
  HTMLMediaElement already connected previously to a different MediaElementSourceNode.
  */
useEffect(()=>{
  const audioContext = new AudioContext()
  const audioElement = audio.current
  fetch(audio.current.src)
  .then(response => response.blob())
  .then(setBlob)
  // const audioSource = audioContext.createMediaElementSource(audioElement)
  

  // const analyser = audioContext.createAnalyser()

  // audioSource.connect(analyser)
  // audioSource.connect(audioContext.destination)

  // analyser.fftSize = 32
  // const bufferLength = analyser.frequencyBinCount
  // const dataArray = new Uint8Array(bufferLength)

  // analyser.getByteFrequencyData(dataArray)


}, [])

  return (<div className={styles.root}> 
    <Button onClick={playPauseHandler}>
      {play &&
        <PauseButtonSvg/>
        ||
        <PlayButtonWhiteSvg/>
      }
    </Button>
    {/* <DumbAudioWaveSvg/> */}
    <AudioVisualizer 
    key={'audio-visualizer'}
    blob={blob}
    width={188} 
    height={32} 
    barWidth={2}
    gap={2}   
    currentTime={time}
    barPlayedColor={'#2F80ED'}
    />
    {/* <audio src={props.audioSrc} ref={audio}/> */}


  </div>)
}