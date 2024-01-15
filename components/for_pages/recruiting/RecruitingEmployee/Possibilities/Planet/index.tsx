import { Bounds, Decal, Environment, OrthographicCamera, useGLTF, useTexture} from '@react-three/drei'
import { Canvas} from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useState } from 'react'
import anime from 'animejs'


export interface ICompany {
  name: string, 
  logo: string, 
  id: number,
  descriptions?: string[],
}
 
interface Props {
  companies: [ICompany, ICompany, ICompany]
  onClick?: (id: number) => void
  active?: boolean
}

function PlanetModel(props: Props) {
  const { nodes, materials, camera } = useGLTF('/models/Globus.glb', true, true, (loader) => {
    loader.setCrossOrigin('anonymous')
  }) as any

  const [tr1, setTr1] = useState<{key: number}>({key: 0})
  const [tr2, setTr2] = useState<{key: number}>({key: 0})
  const [tr3, setTr3] = useState<{key: number}>({key: 0})

  const texture1 = useTexture(props.companies[0].logo)
  const texture2 = useTexture(props.companies[1].logo)
  const texture3 = useTexture(props.companies[2].logo)
  // const texture1 = useTexture('/images/companyLogos/northFaceLogo.png')
  // const texture2 = useTexture('/images/companyLogos/beatsLogo.png')
  // const texture3 = useTexture('/images/companyLogos/googleLogo.png')
  // const texture4 = useTexture('/images/companyLogos/northFaceLogo.png')
  // const texture5 = useTexture('/images/companyLogos/beatsLogo.png')
  // const texture6 = useTexture('/images/companyLogos/googleLogo.png')
  // const texture7 = useTexture('/images/companyLogos/northFaceLogo.png')
  // const texture8 = useTexture('/images/companyLogos/beatsLogo.png')



  useEffect(()=>{
    const targetKey = 70
    if(!props.active) return
    const trAnim = anime.timeline({
      easing: 'easeOutBack',
      autoplay: true,
      duration: 1000,
    })
    trAnim.add({
      targets: tr1,
      key: targetKey,
      update: () => {
        setTr1({key: tr1.key})
      }
    }, 0)
    trAnim.add({
      targets: tr2,
      key: targetKey,
      update: () => {
        setTr2({key: tr2.key})
      }
    }, 200)
    trAnim.add({
      targets: tr3,
      key: targetKey,
      update: () => {
        setTr3({key: tr3.key})
      }
    }, 400)
  }, [props.active])

  


  return (
    <group  dispose={null}>
      <mesh onClick={()=>props.onClick(1)}  position={[2.1, 6.1, 3]} scale={tr1.key/100} rotation={[-1.2,0.3,0.4]}>
        <circleGeometry />
        <meshNormalMaterial />
        <Decal 
        scale={2} 
        
        position={[0, 0, 0]}
        rotation={[0,0,0]}
        polygonOffsetFactor={-1}
        >
          <meshBasicMaterial  map={texture1} color={'0xffffff'}/>
        </Decal>
      </mesh>  
      <mesh onClick={()=>props.onClick(2)} position={[5.1, -4.7, 1.4]} scale={tr2.key/100} rotation={[1.2,0.8,-1]}>
        <circleGeometry />
        <meshNormalMaterial/>
        <Decal 
        scale={2} 
        position={[0, 0, 0]}
        rotation={[0,0,0]}
        polygonOffsetFactor={-1}
        >
          <meshBasicMaterial  map={texture2} color={'0xffffff'}/>
        </Decal>
      </mesh>
      <mesh onClick={()=>props.onClick(3)} position={[4, 4, -4]} scale={tr3.key/100} rotation={[0.8,2.5,-0.5]}>
        <circleGeometry />
        <meshNormalMaterial/>
        <Decal 
        scale={2} 
        position={[0, 0, 0]}
        rotation={[0,0,0]}
        polygonOffsetFactor={-1}
        >
          <meshBasicMaterial  map={texture3} color={'0xffffff'}/>
        </Decal>
      </mesh>
      <mesh onClick={()=>props.onClick(1)}  position={[-4, 4.6, 4]} scale={tr1.key/100} rotation={[-0.8,-0.6,-0.5]}>
        <circleGeometry />
        <meshNormalMaterial/>
        <Decal 
        scale={2} 
        position={[0, 0, 0]}
        rotation={[0,0,0]}
        polygonOffsetFactor={-1}
        >
          <meshBasicMaterial  map={texture1} color={'0xffffff'}/>
        </Decal>
      </mesh>
      <mesh onClick={()=>props.onClick(2)}  position={[-7, 0.6, 0.4]} scale={tr2.key/100} rotation={[-0.6,-1.5,-0.6]}>
        <circleGeometry  />
        <meshNormalMaterial/>
        <Decal 
        scale={2} 
        position={[0, 0, 0]}
        rotation={[0,0,0]}
        polygonOffsetFactor={-1}
        >
          <meshBasicMaterial  map={texture2} color={'0xffffff'}/>
        </Decal>
      </mesh>
      <mesh onClick={()=>props.onClick(3)} position={[4, 0, 1]} scale={tr3.key/100} rotation={[0.4,1.2,-0.5]}>
        <circleGeometry />
        <meshNormalMaterial/>
        <Decal 
        scale={2} 
        position={[0, 0, 0]}
        rotation={[0,0,0]}
        polygonOffsetFactor={-1}
        >
          <meshBasicMaterial map={texture3} color={'0xffffff'}/>
        </Decal>
      </mesh>
      <mesh onClick={()=>props.onClick(1)} position={[-1, -5.7, 4]} scale={tr1.key/100} rotation={[1,-0.1,0.2]}>
        <circleGeometry />
        <meshNormalMaterial colorWrite/>
        <Decal 
        scale={2} 
        position={[0, 0, 0]}
        rotation={[0,0,0]}
        polygonOffsetFactor={-1}
        >
          <meshBasicMaterial map={texture1} color={'0xffffff'}/>
        </Decal>
      </mesh>
      <mesh onClick={()=>props.onClick(2)} position={[-5, 4.4, -2]} scale={tr2.key/100} rotation={[-1.9,-0.8,-1.9]}>
        <circleGeometry />
        <meshNormalMaterial colorWrite/>
        <Decal 
        scale={2} 
        position={[0, 0, 0]}
        rotation={[0,0,0]}
        polygonOffsetFactor={-1}
        >
          <meshBasicMaterial map={texture2} color={'0xffffff'}/>
        </Decal>
      </mesh>
      <mesh geometry={nodes.Globus.geometry} material={materials['Material-Custom.001']} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )


}

export default function Planet(props: Props) {
  return (
    <Canvas>
      <OrthographicCamera 
      makeDefault
      zoom={30} 
      />
      <Bounds fit clip observe damping={0} margin={1}>
        <PlanetModel companies={props.companies} onClick={props.onClick} active={props.active}/>
      </Bounds>
      <OrbitControls maxZoom={35} minZoom={35} enablePan={false}/>
      <Environment files="/models/skidpan.hdr"/>
    </Canvas>
  )
}


useTexture.preload('/images/avatars/1.png')

useGLTF.preload('/models/Globus.glb', true, true, (loader) => {
  loader.setCrossOrigin('anonymous')
})