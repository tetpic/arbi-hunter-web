import {useRef, useState } from 'react'
import styles from './index.module.scss'
import PlayButtonWhiteSvg from 'components/svg/PlayButtonWhiteSvg'
import Button from 'components/ui/Button'
import DumbAudioWaveSvg from 'components/svg/DumbAudioWaveSvg'
import PauseButtonSvg from 'components/svg/PauseButtonSvg'
// import { buffer } from 'stream/consumers'

interface Props {
  isLoading: boolean
  audioSrc: string
}

export default function AudioNode(props: Props) {
  // const audio = useRef<HTMLAudioElement>(null!)
  const audio = useRef<HTMLMediaElement>(new Audio(props.audioSrc))
  const [play, setIsPlay] = useState<boolean>(false)
  audio.current.crossOrigin = 'anonymous'

  const playPauseHandler = () => {
    if(audio.current && audio.current.paused ) {
      audio.current.play()
      setIsPlay(true)

    }
    else {
      audio.current.pause()
      setIsPlay(false)
    }
  }

  audio.current.addEventListener('ended', ()=>{
    setIsPlay(false)
  })



  /*выдает ошибку 
  Failed to execute 'createMediaElementSource' on 'AudioContext': 
  HTMLMediaElement already connected previously to a different MediaElementSourceNode.
  */
// useEffect(()=>{
//   const audioContext = new AudioContext()

//   const audioElement = audio.current
//   const audioSource = audioContext.createMediaElementSource(audioElement)

//   const analyser = audioContext.createAnalyser()

//   audioSource.connect(analyser)
//   audioSource.connect(audioContext.destination)

//   analyser.fftSize = 32
//   const bufferLength = analyser.frequencyBinCount
//   const dataArray = new Uint8Array(bufferLength)

//   analyser.getByteFrequencyData(dataArray)

//   console.log(dataArray)

// }, [])









  return (<div className={styles.root}> 
    <Button onClick={playPauseHandler}>
      {play &&
        <PauseButtonSvg/>
        ||
        <PlayButtonWhiteSvg/>
      }
    </Button>
    <DumbAudioWaveSvg/>
    {/* <audio src={props.audioSrc} ref={audio}/> */}


  </div>)
}