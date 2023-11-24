// import { IThreeModelProps } from 'components/ui/ThreeModel'
import { ICharCategory, ICharItem } from 'data/interfaces/ICharacter'
import CharacterRepository from 'data/repositories/CharacterRepository'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'

interface IState {
  init: ()=> void,
  load: boolean,
  activeSet: [ICharCategory, ICharItem[]],
  variant: {[key: string]: string|number},
  setVariant: (data: ICharItem) => void
  setActiveSet: (data: [ICharCategory, ICharItem[]]) => void
  categories: Map<ICharCategory, ICharItem[]>
  activeItem: ICharItem,
  setActiveItem: Dispatch<SetStateAction<ICharItem>>
}
  
const defaultVariant: {[key: string]: string|number} = {
  model: 'man',
  body: 0,
  size: 0,
  eye: 0,
  emotion: 0,
  hair: 0,
  jacket: 0,
}


const CharacterContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function CharacterWrapper(props: Props) {
  const [activeSet, setActiveSetState] = useState<[ICharCategory, ICharItem[]]>([undefined, undefined])
  const [activeItem, setActiveItem] = useState<ICharItem>()
  const [variant, setVariantState] = useState<{[key: string]: string|number}>(defaultVariant)
  const [load, setLoad] = useState<boolean>(true)
  const [categories, setCategoriesState] = useState<Map<ICharCategory, ICharItem[]>>(new Map)

  const init = async() => {
    await CharacterRepository.getCurrentUserChar()
    .then(res=> {
      const setItems:any = {model: res.gender==='male'?'man':'woman'}
      setItems.eye = 0
      setItems.hair = 0
      res.items.forEach(el=> setItems[el.category.key] = el.animationKey)
      setVariantState(setItems)
    })
    .catch(err=> {
      setLoad(false)
    })
    
    await CharacterRepository.fetchCharacterCategoryList()
    .then(res=> {
      setCategoriesState(state=> {
        state.clear()
        res.forEach(c=> {
          state.set(c, undefined)
        })
        return new Map(state)
      })
      setActiveSetState([res[0], undefined])
    })

    await CharacterRepository.fetchItemsList()
    .then(res=> {
      setCategoriesState(state=> {
        state.forEach((v, k)=> {
          state.set(k, res.filter(c => c.categoryId === k.id))
        })
        return new Map(state)
      })
    })
    setLoad(false)
  }

  const setVariant = (data: ICharItem) => {
    if(data.category.key === 'model' && data.animationKey !== variant.model) {
      setVariantState({...defaultVariant, model: data.animationKey as 'man'|'woman'} )
    }
    else {
      
      setVariantState(state=> {
        if(data?.id === activeItem?.id && (data.category?.key === 'cap'||data.category?.key === 'jacket'||data.category?.key === 'glasses')) {
          delete state[data.category?.key]
          return state
        } 
        else {
          return {...state, [data.category?.key]: data.animationKey}}
        }
      )
    }
  }

  const setActiveSet = (data: [ICharCategory, ICharItem[]]) => {
    const filteredItems = data[1]?.filter(f=> !f.name?.includes(`${variant.model}_`))
    setActiveItem(filteredItems?.find(el=> variant[el.category.key] === el.animationKey))
    setActiveSetState([data[0], filteredItems])
  }

  const value: IState = {
    init,
    load,
    activeSet,
    variant,
    setVariant,
    setActiveSet,
    categories,
    activeItem,
    setActiveItem
  }

  return (
    <CharacterContext.Provider value={value}>
      {props.children}
    </CharacterContext.Provider>
  )
}

export function useCharacterContext() {
  return useContext(CharacterContext)
}
