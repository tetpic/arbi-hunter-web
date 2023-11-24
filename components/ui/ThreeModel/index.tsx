import {useAnimations, useGLTF} from '@react-three/drei'
import { useEffect, useRef } from 'react'

export interface IThreeModelProps {
    model: 'man' | 'woman'
    body?: number,
    hair?: number
    emotion?: number
    headVariant?: number
    cap?: number
    chain?: number
    face?: number
    glasses?: number
    jacket?: number
    eye?: number
    size?: number
    color?: number,
    r?: number
}

export function ThreeModel(props: IThreeModelProps) {
  const mesh = useRef()
    const  {nodes, materials, animations} = useGLTF(`/models/model_${props.model}.glb`, true, true, (loader) => {
        loader.setCrossOrigin('anonymous')
    }) as any
    
    const { actions } = useAnimations(animations, mesh)
    useEffect(()=>{
        actions.Action_test_2.play()
    }, [])



    return (
        <group {...props} ref={mesh} dispose={null}>
          <group name="Scene">
            <group name="Арматура">
              <primitive object={nodes.Spine} />
              <primitive object={nodes.neutral_bone} />
              <skinnedMesh 
              name={`Body_${props.body||'0'}${props.body||'_0'}`} 
              geometry={nodes[`Body_${props.body||'0'}_${props.body||'0'}`].geometry} 
              material={materials[`Body_${props.color||'0'}`]} 
              skeleton={nodes[`Body_${props.body||'0'}_${props.body||'0'}`].skeleton} />
              {props.cap && 
                <skinnedMesh name={`Cap_${props.cap}`} geometry={nodes[`Cap_${props.cap}`].geometry} material={materials[`Cap_${props.cap}`]} skeleton={nodes[`Cap_${props.cap}`].skeleton} />
              }
              {props.chain &&
              <skinnedMesh name={`Chain_${props.chain}_${props.body}`} geometry={nodes[`Chain_${props.chain}_${props.body}`].geometry} material={materials[`Chain_${props.chain}`]} skeleton={nodes[`Chain_${props.chain}_${props.body}`].skeleton} />
              }
              <skinnedMesh name={`Eye_${props.eye||'0'}`} geometry={nodes[`Eye_${props.eye||'0'}`].geometry} material={materials[`Eye_${props.eye||'0'}`]} skeleton={nodes[`Eye_${props.eye||'0'}`].skeleton} />
              <skinnedMesh name={`Face_${props.face||'0'}`} geometry={nodes[`Face_${props.face||'0'}`].geometry} material={materials[`Face_${props.face||'0'}`]} skeleton={nodes[`Face_${props.face||'0'}`].skeleton} />
              {props.glasses &&
                <skinnedMesh name={`Glasses_${props.glasses}`} geometry={nodes[`Glasses_${props.glasses}`].geometry} material={materials[`Glasses_${props.glasses}`]} skeleton={nodes[`Glasses_${props.glasses}`].skeleton} />
              }
              {props.hair && 
                <skinnedMesh name={`Hair_${!props.cap&&props.hair||'0'}`} geometry={nodes[`Hair_${!props.cap&&props.hair||'0'}`].geometry} material={materials[`Hair_${!props.cap&&props.hair||'0'}`]} skeleton={nodes[`Hair_${!props.cap&&props.hair||'0'}`].skeleton} />
              }
              <skinnedMesh name={`Head_${props.emotion||'0'}_${props.emotion||'0'}`} geometry={nodes[`Head_${props.emotion||'0'}_${props.emotion||'0'}`].geometry} material={materials[`Head_${props.color||'0'}`]} skeleton={nodes[`Head_${props.emotion||'0'}_${props.emotion||'0'}`].skeleton} />
              <skinnedMesh name={`Jacket_${props.jacket||'0'}_${props.body||'0'}`} geometry={nodes[`Jacket_${props.jacket||'0'}_${props.body||'0'}`].geometry} material={materials[`Jacket_${props.jacket||'0'}`]} skeleton={nodes[`Jacket_${props.jacket||'0'}_${props.body||'0'}`].skeleton} />
            </group>
          </group>         
        </group>
    )
}

useGLTF.preload('/models/model_man.glb', true, true, (loader) => {
    loader.setCrossOrigin('anonymous')
})
useGLTF.preload('/models/model_woman.glb', true, true, (loader) => {
    loader.setCrossOrigin('anonymous')
})

   {/* {typeof props.body !== 'undefined' && props.body !== null && <mesh 
                geometry={nodes[`Body_${props.body}${props.body?'_'+props.body:'_0'}`].geometry}
                material={materials[`Body_${props.color?props.color:'0'}`]}
            />}
            {typeof props.face !== 'undefined' && props.face !== null && <mesh 
                geometry={nodes[`Face_${props.face}`].geometry}
                material={materials[`Face_${props.face}`]}
            />}
            {typeof props.hair !== 'undefined' && props.hair !== null && <mesh 
                geometry={nodes[`Hair_${props.cap?'0':props.hair}`].geometry}
                material={materials[`Hair_${props.cap?'0':props.hair}`]}
            />}
            {typeof props.eye !== 'undefined' && props.eye !== null && <mesh 
                geometry={nodes[`Eye_${props.eye}`].geometry}
                material={materials[`Eye_${props.eye}`]}
            />}
            {typeof props.cap !== 'undefined' && props.model === 'man' && props.cap !== null && <mesh 
                geometry={nodes[`Cap_${props.cap}`].geometry}
                material={materials[`Cap_${props.cap}`]}
            />}
            {typeof props.chain !== 'undefined' && props.chain !== null && <mesh 
                geometry={nodes[`Chain_${props.chain}${props.body?'_'+props.body:'_0'}`].geometry}
                material={materials[`Chain_${props.chain}`]}
            />}
            {typeof props.emotion !== 'undefined' && props.emotion !== null && <mesh
                geometry={nodes[`Head_${props.emotion}${props.emotion?'_'+props.emotion:'_0'}`].geometry}
                material={materials[`Head_${props.color?props.color:'0'}`]}
            />}
            {typeof props.glasses !== 'undefined' && props.glasses !== null &&  <mesh
                geometry={nodes[`Glasses_${props.glasses}`].geometry}
                material={materials[`Glasses_${props.glasses}`]}
            />}
            {typeof props.jacket !== 'undefined' && props.jacket !== null &&  <mesh
                geometry={nodes[`Jacket_${props.jacket}${props.body?'_'+props.body:'_0'}`].geometry}
                material={materials[`Jacket_${props.jacket}`]}
            />}
            <bone 
            name={'Spine'} position={nodes['Spine'].position} quaternion={nodes['Spine'].quaternion} scale={nodes['Spine'].scale}/>             */}
