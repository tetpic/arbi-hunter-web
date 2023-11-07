import {useGLTF} from '@react-three/drei'

export interface IThreeModelProps {
    model: 'man' | 'woman'
    body?: number,
    bodyVariant?: number
    hair?: number
    head?: number
    cap?: number
    chain?: number
    chainVariant?: number
    face?: number
    glasses?: number
    jacket?: number
    jacketVariant?: number
    eye?: number
}

export function ThreeModel(props: IThreeModelProps) {
    const {nodes, materials} = useGLTF(`/models/model_${props.model}.glb`, true, true, (loader) => {
        loader.setCrossOrigin('anonymous')
    }) as any

    return (
        <group {...props} dispose={null}>
            {typeof props.body !== 'undefined' && props.body !== null && <mesh
                geometry={nodes[`Body_${props.body}${props.bodyVariant?'_'+props.bodyVariant:'_0'}`].geometry}
                material={materials[`Body_${props.body}`]}
            />}
            {typeof props.face !== 'undefined' && props.face !== null && <mesh
                geometry={nodes[`Face_${props.face}`].geometry}
                material={materials[`Face_${props.face}`]}
            />}
            {typeof props.hair !== 'undefined' && props.hair !== null && <mesh
                geometry={nodes[`Hair_${props.hair}`].geometry}
                material={materials[`Hair_${props.hair}`]}
            />}
            {typeof props.eye !== 'undefined' && props.eye !== null && <mesh
                geometry={nodes[`Eye_${props.eye}`].geometry}
                material={materials[`Eye_${props.eye}`]}
            />}
            {typeof props.cap !== 'undefined' && props.cap !== null && <mesh
                geometry={nodes[`Cap_${props.cap}`].geometry}
                material={materials[`Cap_${props.cap}`]}
            />}
            {typeof props.chain !== 'undefined' && props.chain !== null && <mesh
                geometry={nodes[`Chain_${props.chain}${props.chainVariant?'_'+props.chainVariant:'_0'}`].geometry}
                material={materials[`Chain_${props.chain}`]}
            />}
            {typeof props.head !== 'undefined' && props.head !== null && <mesh
                geometry={nodes[`Head_${props.head}`].geometry}
                material={materials[`Head_${props.head}`]}
            />}
            {typeof props.glasses !== 'undefined' && props.glasses !== null &&  <mesh
                geometry={nodes[`Glasses_${props.glasses}`].geometry}
                material={materials[`Glasses_${props.glasses}`]}
            />}
            {typeof props.jacket !== 'undefined' && props.jacket !== null &&  <mesh
                geometry={nodes[`Jacket_${props.jacket}${props.jacketVariant?'_'+props.jacketVariant:'_0'}`].geometry}
                material={materials[`Jacket_${props.jacket}`]}
            />}
        </group>
    )
}

useGLTF.preload('/models/model_man.glb', true, true, (loader) => {
    loader.setCrossOrigin('anonymous')
})
useGLTF.preload('/models/model_woman.glb', true, true, (loader) => {
    loader.setCrossOrigin('anonymous')
})
