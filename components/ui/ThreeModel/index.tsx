import {useAnimations, useGLTF} from '@react-three/drei'
// import { useFrame } from '@react-three/fiber'
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
    const  {nodes, materials, animations} = useGLTF(`/models/model_${props.model}.glb`, true, true, (loader) => {
        loader.setCrossOrigin('anonymous')
    }) as any


    const mesh = useRef(null!)

    const { actions } = useAnimations(animations, mesh)

    // useFrame(({ clock }) => {
    //     mesh.current.rotation.y = clock.getElapsedTime()
    // })

    useEffect(()=>{

        actions.Action_test.play()
    }, [actions])


    return (
        <group {...props} ref={mesh} dispose={null}>
            {typeof props.body !== 'undefined' && props.body !== null && <mesh 
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
            <bone name={'Spine'} position={nodes['Spine'].position} quaternion={nodes['Spine'].quaternion} scale={nodes['Spine'].scale}/>
            <bone name={'Spine_1'} position={nodes['Spine_1'].position} quaternion={nodes['Spine_1'].quaternion} scale={nodes['Spine_1'].scale}/>
            <bone name={'Neck'} position={nodes['Neck'].position}/>
            <bone name={'Head'}  position={nodes['Head'].position}/>
            <bone name={'Shoulder_L'}  position={nodes['Shoulder_L'].position}/>
            <bone name={'Shoulder_R'}  position={nodes['Shoulder_R'].position}/>
            <bone name={'Upper_arm_L'}  position={nodes['Upper_arm_L'].position}/>
            <bone name={'Upper_arm_R'}  position={nodes['Upper_arm_R'].position}/>
            <bone name={'Forearm_L'}  position={nodes['Forearm_L'].position}/>
            <bone name={'Forearm_R'}  position={nodes['Forearm_R'].position}/>

        </group>
    )
}

useGLTF.preload('/models/model_man.glb', true, true, (loader) => {
    loader.setCrossOrigin('anonymous')
})
useGLTF.preload('/models/model_woman.glb', true, true, (loader) => {
    loader.setCrossOrigin('anonymous')
})
