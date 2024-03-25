import {Canvas, useThree} from '@react-three/fiber'
import {Bounds, Environment, OrbitControls, OrthographicCamera, PerspectiveCamera} from '@react-three/drei'
import { useEffect, useRef, useState} from 'react'
import { ThreeModel } from 'components/ui/ThreeModel'
import styles from './index.module.scss'
import { useCharacterContext } from 'context/character_state'
import { ModelActions } from '../profile/userProfile/UserEditor'




const Camera = () => {
  const camera = useRef<any>(null)
  const {viewport, size} = useThree()
  const set = useThree(state => state.set)

  const pixelToThreeUnitRatio = 1
  const planeDistance = 0
  const cameraDistance = 4
  const distance = cameraDistance - planeDistance
  const height = size.height / pixelToThreeUnitRatio
  const halfFovRadians = Math.atan((height / 2) / distance)
  const fov = 2 * halfFovRadians * (180 / Math.PI)
  useEffect(() => {
      set({camera: camera.current as any})
  }, [])

  return <PerspectiveCamera
    ref={camera}
    aspect={viewport.getCurrentViewport().factor}
    fov={fov}
    near={0.1}
    far={100}
    position={[0, 0, cameraDistance]}
    onUpdate={self => self.updateProjectionMatrix()}
  />
}

export default function ThreeModelVariant (props: {onSave?: ()=>void, disableControls?: boolean, data: {[key: string]: string|number}, r:number, actions?: ModelActions }) {
  
  const characterContext = useCharacterContext()
  const [canvasSizes, setCanvasSizes] = useState<{width: number, height: number}|null>(null)

  const canvasRef = useRef<HTMLCanvasElement>()

  useEffect(()=>{
    if(characterContext?.modelLoaded && characterContext?.dataLoaded) {
      setTimeout(() => {
        canvasRef.current.toBlob((blob)=> {
          characterContext.setDataBaseBlob(blob)
        })
      }, 20)
    }
  }, [characterContext.choosenItems])


  useEffect(()=>{
    window.addEventListener('resize', ()=>{
      setCanvasSizes({width: canvasRef.current?.offsetWidth||200, height: canvasRef.current?.offsetWidth||200})
    })
  }, [])

  useEffect(()=>{
    setTimeout(()=>{
      setCanvasSizes({width: canvasRef.current?.offsetWidth||200, height: canvasRef.current?.offsetWidth||200})  
    }, 100)
  }, [characterContext.dataLoaded])


  return (<div className={styles.root}>
    {/* {dataBaseBlob &&
    <img src={URL.createObjectURL(dataBaseBlob)} alt="" />
    } */}

    {props &&
      <Canvas  key={'canvas'} gl={{ preserveDrawingBuffer: true }} ref={canvasRef}  style={{width: '100%', height: '100%', opacity: canvasSizes?1:0, transition: '.1s linear'}}>
        <OrthographicCamera view={{
          enabled: true,
          fullHeight: 500,
          fullWidth: 500,
          offsetX: 0,
          offsetY: -260,
          width: 500,
          height: 500
        }} 
        makeDefault 
        position={[Number(props.r)||0, 1, 7]} zoom={canvasSizes?canvasSizes.width/3.1:50} />

        <Bounds clip observe damping={0} margin={1}>
          <ThreeModel {...props.data as any} actions={props.actions}/>
        </Bounds>
        <Environment files="/models/skidpan.hdr"/>
        <OrbitControls makeDefault enableZoom={false} enablePan={false} enableRotate={!props.disableControls} maxAzimuthAngle={0.8} minAzimuthAngle={-0.8} minPolarAngle={1.6} maxPolarAngle={1.6}/>
      </Canvas>
    }
  </div>

  )
}
