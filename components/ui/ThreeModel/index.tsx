import {useAnimations, useGLTF} from '@react-three/drei'
import { ModelActions } from 'components/for_pages/profile/userProfile/UserEditor'
import { useCharacterContext } from 'context/character_state'
import { useEffect, useRef } from 'react'

export interface IThreeModelProps {
    model: 'man' | 'woman'
    body?: number|string,
    hair?: number|string
    emotion?: number|string
    headVariant?: number|string
    cap?: number|string
    chain?: number|string
    face?: number|string
    glasses?: number|string
    jacket?: number|string
    eye?: number|string
    size?: number|string
    color?: number|string,
    r?: number
    actions: ModelActions
    unic: 'unic'|undefined
}



export function ThreeModel(props: IThreeModelProps) {
  const mesh = useRef()
  const characterContext = useCharacterContext()
  const currentAction = useRef<ModelActions>(props.actions)
  const  {nodes, materials, animations} = useGLTF(`/models/model_${props.model}.glb`, true, true, (loader) => {
    loader.setCrossOrigin('anonymous')
  }) as any
    
  const { actions } = useAnimations(animations, mesh)

  useEffect(()=>{   
    
    if(!actions[currentAction.current]) {
      return
    }
    currentAction.current&&actions[currentAction.current].stop()
    actions[props.actions]?.play()
    currentAction.current = props.actions
  }, [props.actions])

  useEffect(()=>{
    if(nodes && characterContext?.dataLoaded) {
      setTimeout(()=>{
        characterContext.setModelLoad(true)
      }, 500)
    }
  }, [nodes, characterContext?.dataLoaded])

  useEffect(()=>{
    characterContext?.setDurations(state=> {
      (animations as {name: string, duration: number}[]).map((animation)=>{
        //тут погрешность продолжительности анимации, поэтому минус 10 милисекунд сделали переходы плавнее
        state[animation.name] = animation.duration - 0.01
      })
      return {...state}
    })
  
  }, [animations])

  if(props.model === 'woman') {
    return (
      <group {...props}  ref={mesh} dispose={null}>
        <group name="Scene">
          <group name="Арматура" key={1}>
            <primitive object={nodes.Spine} />
            <skinnedMesh 
            name={`Body_${props.body||'0'}${props.body||'_0'}`} 
            geometry={nodes[`Body_${props.body||'0'}_${props.body||'0'}`].geometry} 
            material={materials[`Body_${props.color||'0'}`]} 
            skeleton={nodes[`Body_${props.body||'0'}_${props.body||'0'}`].skeleton} />     

            {props.chain !== undefined &&
              <skinnedMesh name={`Chain_${props.chain}_${props.body||'0'}`} geometry={nodes[`Chain_${props.chain}_${props.body||'0'}`].geometry} material={materials[`Chain_${props.chain}`]} skeleton={nodes[`Chain_${props.chain}_${props.body||'0'}`].skeleton} />
            }        
            <skinnedMesh name={`Eye_${props.eye||'0'}`} geometry={nodes[`Eye_${props.eye||'0'}`].geometry} material={materials[`Eye_${props.eye||'0'}`]} skeleton={nodes[`Eye_${props.eye||'0'}`].skeleton} />
            {props.face !== undefined && 
              <skinnedMesh name={`Face_${props.face||'0'}`} geometry={nodes[`Face_${props.face||'0'}`].geometry} material={materials[`Face_${props.face||'0'}`]} skeleton={nodes[`Face_${props.face||'0'}`].skeleton} />
            }        
            {props.glasses !== undefined &&
              <skinnedMesh name={`Glasses_${props.glasses}`} geometry={nodes[`Glasses_${props.glasses}`].geometry} material={materials[`Glasses_${props.glasses}`]} skeleton={nodes[`Glasses_${props.glasses}`].skeleton} />
            }        
            {props.hair !== undefined && 
              <skinnedMesh name={`Hair_${props.cap||props.hair||'0'}`} geometry={nodes[`Hair_${props.cap||props.hair||'0'}`].geometry} material={materials[`Hair_${props.cap||props.hair||'0'}`]} skeleton={nodes[`Hair_${props.cap||props.hair||'0'}`].skeleton} />
            }        
            <skinnedMesh name={`Hair_${props.cap||props.hair||'0'}`} geometry={nodes[`Hair_${props.cap||props.hair||'0'}`].geometry} material={materials[`Hair_${props.cap||props.hair||'0'}`]} skeleton={nodes[`Hair_${props.cap||props.hair||'0'}`].skeleton} />
            <skinnedMesh name={`Head_${props.face !== '1' &&props.emotion||'0'}_${props.face !== '1' &&props.emotion||'0'}`} geometry={nodes[`Head_${props.face !== '1' &&props.emotion||'0'}_${props.emotion||'0'}`].geometry} material={materials[`Head_${props.color||'0'}`]} skeleton={nodes[`Head_${props.emotion||'0'}_${props.emotion||'0'}`].skeleton} />
            <skinnedMesh name={`Jacket_${props.jacket||'3'}_${props.body||'0'}`} geometry={nodes[`Jacket_${props.jacket||'3'}_${props.body||'0'}`].geometry} material={materials[`Jacket_${props.jacket||'3'}`]} skeleton={nodes[`Jacket_${props.jacket||'3'}_${props.body||'0'}`].skeleton} />
          </group>
        </group>
      </group>
    )
  }
  else if(props.model === 'man' && !props.unic) {
  return (      
    <group {...props} key={2} ref={mesh} dispose={null}>
         <group name={'Scene'}>
        <group name={'Арматура'} key={2}>
          <primitive object={nodes.Spine} />
          <skinnedMesh 
          name={`Body_${props.body||'0'}${props.color||'_0'}`} 
          geometry={nodes[`Body_${props.body||'0'}_${props.color||'0'}`].geometry} 
          material={materials[`Body_${props.color||'0'}`]} 
          skeleton={nodes[`Body_${props.body||'0'}_${props.color||'0'}`].skeleton} />
          {props.cap && props.model === 'man' &&
            <skinnedMesh name={`Cap_${props.cap}`} geometry={nodes[`Cap_${props.cap}`].geometry} material={materials[`Cap_${props.cap}`]} skeleton={nodes[`Cap_${props.cap}`].skeleton} />
          }
          {props.chain !== undefined &&
          <skinnedMesh name={`Chain_${props.chain}_${props.body||'0'}`} geometry={nodes[`Chain_${props.chain}_${props.body||'0'}`].geometry} material={materials[`Chain_${props.chain}`]} skeleton={nodes[`Chain_${props.chain}_${props.body||'0'}`].skeleton} />
          }
          <skinnedMesh name={`Eye_${props.eye||'0'}`} geometry={nodes[`Eye_${props.eye||'0'}`].geometry} material={materials[`Eye_${props.eye||'0'}`]} skeleton={nodes[`Eye_${props.eye||'0'}`].skeleton} />
          {props.face !== undefined && 
          <skinnedMesh name={`Face_${props.face||'0'}`} geometry={nodes[`Face_${props.face||'0'}`].geometry} material={materials[`Face_${props.face||'0'}`]} skeleton={nodes[`Face_${props.face||'0'}`].skeleton} />
          }
          {props.glasses !== undefined && props.face !== '1' &&
            <skinnedMesh name={`Glasses_${props.glasses}`} geometry={nodes[`Glasses_${props.glasses}`].geometry} material={materials[`Glasses_${props.glasses}`]} skeleton={nodes[`Glasses_${props.glasses}`].skeleton} />
          }
          {props.hair !== undefined && 
            <skinnedMesh name={`Hair_${!props.cap&&props.hair||'0'}`} geometry={nodes[`Hair_${!props.cap&&props.hair||'0'}`].geometry} material={materials[`Hair_${!props.cap&&props.hair||'0'}`]} skeleton={nodes[`Hair_${!props.cap&&props.hair||'0'}`].skeleton} />
          }
          <skinnedMesh 
          name={`Head_${props.face !== '1' &&props.emotion||'0'}_0`} 
          geometry={nodes[`Head_${props.face !== '1' &&props.emotion||'0'}_0`].geometry} 
          material={materials[`Head_${props.color||'0'}`]} 
          skeleton={nodes[`Head_${props.emotion||'0'}_0`].skeleton} />
          <skinnedMesh name={`Jacket_${props.jacket||'3'}_${props.body||'0'}`} geometry={nodes[`Jacket_${props.jacket||'3'}_${props.body||'0'}`].geometry} material={materials[`Jacket_${props.jacket||'3'}`]} skeleton={nodes[`Jacket_${props.jacket||'3'}_${props.body||'0'}`].skeleton} />
        </group>
      </group> 
    </group>
  )
  }
  else if(props.unic && props.unic === 'unic') {
    return (

    <group {...props} key={3} ref={mesh} dispose={null}>
      <group name={'Scene'}>
        <group name={'Арматура'} key={3}>
          <primitive object={nodes.Spine} />
          <skinnedMesh 
          name={`Body_${props.body||'0'}${props.color||'_0'}`} 
          geometry={nodes[`Body_${props.body||'0'}_0`].geometry} 
          material={materials['Body_0']} 
          skeleton={nodes[`Body_${props.body||'0'}_0`].skeleton} />

          {props.chain !== undefined &&
          <skinnedMesh name={`Chain_${props.chain}_${props.body||'0'}`} geometry={nodes[`Chain_${props.chain}_${props.body||'0'}`].geometry} material={materials[`Chain_${props.chain}`]} skeleton={nodes[`Chain_${props.chain}_${props.body||'0'}`].skeleton} />
          }
          
          {props.glasses !== undefined && 
            <skinnedMesh name={`Glasses_${props.glasses}`} geometry={nodes[`Glasses_${props.glasses}`].geometry} material={materials[`Glasses_${props.glasses}`]} skeleton={nodes[`Glasses_${props.glasses}`].skeleton} />
          }
          
          <skinnedMesh name="Hair_Unic" geometry={nodes.Hair_Unic.geometry} material={materials.Hair_Unic} skeleton={nodes.Hair_Unic.skeleton} />

          <skinnedMesh name="Head_Unic_{props.emotion||'0'}" geometry={nodes[`Head_Unic_${props.emotion||'0'}`].geometry} material={materials.Head_Unic} skeleton={nodes[`Head_Unic_${props.emotion||'0'}`].skeleton} />
          <skinnedMesh name={`Jacket_${props.jacket||'7'}_${props.body||'0'}`} geometry={nodes[`Jacket_${props.jacket||'7'}_${props.body||'0'}`].geometry} material={materials[`Jacket_${props.jacket||'7'}`]} skeleton={nodes[`Jacket_${props.jacket||'7'}_${props.body||'0'}`].skeleton} />
        </group>
      </group> 
    </group>
        )

  }
  else {
    return null
  }
}

useGLTF.preload('/models/model_man.glb', true, true, (loader) => {
    loader.setCrossOrigin('anonymous')
})
useGLTF.preload('/models/model_woman.glb', true, true, (loader) => {
    loader.setCrossOrigin('anonymous')
})