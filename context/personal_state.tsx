import { IFile } from 'data/interfaces/Common'
import { IPersonalPage, IPersonalPageBlock } from 'data/interfaces/IPersonal'
import PersonalRepository from 'data/repositories/PersonalRepository'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'

interface IState {
  setPersonalPage: () => void
  personalPage: IPersonalPage
  updatePersonalPage: (data?: Partial<IPersonalPageBlock[]>) => Promise<IPersonalPage>
  blocks: Map<number, {block: IPersonalPageBlock, assets: IFile[]}>
  setBlocks: Dispatch<SetStateAction<Map<number, {block: IPersonalPageBlock, assets: IFile[]}>>>
}

const PersonalContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function PersonalWrapper(props: Props) {
  const [personalPage, setPersonalPageState] = useState<IPersonalPage>(null)
  const [blocks, setBlocks] = useState<Map<number, {block: IPersonalPageBlock, assets: IFile[]}>>(new Map)



  const setPersonalPage = () => {
    PersonalRepository.getPersonalPage()
    .then(res=> {
      setPersonalPageState(res)
      res.blocks.forEach(block => {
        const assets = res.assets.filter(el=> block.assets.includes(el.id))
        setBlocks(state=> state.set(block.order, {block, assets}))
      })
    })
    .catch(_=>{
      setPersonalPageState(undefined)
    })
  }

  const updatePersonalPage = async (): Promise<IPersonalPage> => {
    const orderedBlocks = [...blocks.values()].map((el, index)=> ({...el.block, order: index+1}))
    if(personalPage === undefined) {
      return PersonalRepository.createPersonalPage(orderedBlocks)
      .then(res=> {
        setPersonalPageState(res)
        return res
      })
    }
    else {
      return PersonalRepository.updatePersonalPage(personalPage?.id , orderedBlocks)
      .then(res=> {
        setPersonalPageState(res)
        return res
      })
      .catch(_=> {
        return null
      })
    }
  }


  const value: IState = {
    personalPage,
    setPersonalPage,
    updatePersonalPage,
    blocks, 
    setBlocks, 
  }

  return (
    <PersonalContext.Provider value={value}>
      {props.children}
    </PersonalContext.Provider>
  )
}

export function usePersonalContext() {
  return useContext(PersonalContext)
}
