import {Canvas, useThree} from '@react-three/fiber'
import {Bounds, Environment, PerspectiveCamera} from '@react-three/drei'
import { useEffect, useRef} from 'react'
import { IThreeModelProps, ThreeModel } from 'components/ui/ThreeModel'
import styles from './index.module.scss'




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

export default function ThreeModelVariant (props: IThreeModelProps) {


//   const [variant, setVariant] = useState(/*(window as any)?.personParams ?? */props)


//   useEffect(() => {
//       const handleMessage = (data: any) => {
//           setVariant(JSON.parse(data))
//       }
//       (window as any).fromFlutter = handleMessage

//       return () => {
//           (window as any).fromFlutter = null
//       }
//   }, [])
  return (<div className={styles.root}>
    {props &&
      <Canvas camera={{fov: 50, near: 0.1, far: 1000, position: [0, 0, 7]}} style={{width: '100%', height: '300px'}}>
            <Bounds fit clip observe damping={0} margin={1}>
              <ThreeModel {...props as any}/>
          </Bounds>
          <Environment files="/models/texture.hdr"/>
      </Canvas>
    }
      <code>{JSON.stringify(props)}</code>
  </div>

  )
}