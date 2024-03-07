import { ICharCategory, ICharItem } from 'data/interfaces/ICharacter'
import CharacterRepository from 'data/repositories/CharacterRepository'
import FileRepository from 'data/repositories/FileRepository'
import UserRepository from 'data/repositories/UserRepository'
import { Dispatch, SetStateAction, createContext, useContext, useRef, useState } from 'react'
import { useUserContext } from './user_state'
import { useAppContext } from './state'
import { SnackbarType } from 'types/enums'

interface IState {
  init: ()=> void,
  modelLoaded: boolean,
  setModelLoad: Dispatch<SetStateAction<boolean>>
  activeSet: [ICharCategory, ICharItem[]],
  variant: {[key: string]: string|number},
  setVariant: (data: ICharItem) => void
  setActiveSet: (data: [ICharCategory, ICharItem[]]) => void
  categories: Map<ICharCategory, ICharItem[]>
  activeItem: ICharItem,
  setActiveItem: Dispatch<SetStateAction<ICharItem>>
  dataLoaded: boolean
  saveCurrentSet: () => Promise<boolean>
  choosenItems: Map<number, ICharItem>
  setDataBaseBlob: Dispatch<SetStateAction<Blob>>
  dataBaseBlob: Blob
  savingProcess: boolean
  durations: {[key: string]: number;}
  setDurations: Dispatch<SetStateAction<{[key: string]: number;}>>
}
  
const defaultVariant: {[key: string]: string|number} = {
  model: 'man',
  eye: 0,
  hair: 0
}


const CharacterContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function CharacterWrapper(props: Props) {
  const userContext = useUserContext()
  const appContext = useAppContext()
  const [activeSet, setActiveSetState] = useState<[ICharCategory, ICharItem[]]>([undefined, undefined])
  const isCharacterExist = useRef<boolean>(false)
  const [choosenItems, setChoosenItemsState] = useState<Map<number, ICharItem>>(new Map)
  const [activeItem, setActiveItem] = useState<ICharItem>()
  const [variant, setVariantState] = useState<{[key: string]: string|number}>(defaultVariant)
  const [modelLoaded, setModelLoad] = useState<boolean>(false)
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)
  const [savingProcess, setSavingProcess] = useState<boolean>(false)
  const [categories, setCategoriesState] = useState<Map<ICharCategory, ICharItem[]>>(new Map)
  const characterId = useRef<number>(null)
  const [dataBaseBlob, setDataBaseBlob] = useState<Blob>(null)
  const [durations, setDurations ] = useState<{[key: string]: number}>({})

  const init = async() => {
    if(!userContext.currentProfile) {
      return    
    }
    await CharacterRepository.getCurrentUserChar()
    .then(res=> {
      isCharacterExist.current = true
      characterId.current = res.id
      const setItems:any = {model: res.gender==='male'?'man':'woman'}
      setItems.eye = 0
      setItems.hair = 0
      res.items.forEach(el=> {
        if(el.gender === res.gender) {
          setItems[el.category.key] = el.animationKey          
        }
      })
      setVariantState(setItems)
      setChoosenItemsState(state=> {
        state.clear()
        res.items.forEach(el=> el.gender===res.gender&&state.set(el.category.id, el))
        return new Map(state)
      })
    })
    .catch(_=> {
      isCharacterExist.current = false
      setDataLoaded(true)
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
    setDataLoaded(true)
  }

  const setVariant = (data: ICharItem) => {
    setChoosenItemsState(state=> {
      if(data?.id === activeItem?.id && (data.category?.key === 'cap'||data.category?.key === 'jacket'||data.category?.key === 'glasses'||data.category?.key === 'face'||data.category?.key === 'chain')) {
        state.delete(data.category.id)        
      }
      else {
        state.set(data.category.id, data)
      }
      return new Map(state)
    })
    if(data.category.key === 'model' && data.animationKey !== variant.model) {
      setVariantState({...defaultVariant, model: data.gender==='female'?'woman':'man'} )
    }
    else {
      setVariantState(state=> {
        if(data?.id === activeItem?.id && (data.category?.key === 'cap'||data.category?.key === 'jacket'||data.category?.key === 'glasses'||data.category?.key === 'face'||data.category?.key === 'chain')) {
          delete state[data.category?.key]
          return state
        } 
        else {
          return {...state, [data.category?.key]: data.animationKey}}
        }
      )
    }
  }

  const saveCurrentSet = async(): Promise<boolean> => {
    if(!userContext.currentProfile) {
      return    
    }
    setSavingProcess(true)    
    await CharacterRepository.createCharacter({gender: variant.model === 'man'?'male':'female'})
    .then(res=> {
      characterId.current = res.id
    })
    const file = new File([dataBaseBlob], 'test.png', {type: 'image/png'})
    const fileId = await FileRepository.uploadFile(file)
    .then(res=> {
      return res.id
    })
    await UserRepository.editProfileByType({logoId: fileId, useOwnLogo: true}, userContext?.currentProfile?.profileType)
    CharacterRepository.updateCharacter([...choosenItems.values()].map(el=> el.id), characterId.current)
    .then(res=> {
      appContext.showSnackbar('Изображение сохранено', SnackbarType.success)
      userContext.updateUser()
      setSavingProcess(false)
    })  
    setTimeout(()=> {
      userContext.updateUser()      
    },1500)
    return true
  }



  const setActiveSet = (data: [ICharCategory, ICharItem[]]) => {
    const filteredItems = data[0].key  === 'model'?data[1]: data[1]?.filter(f=> f.gender === (variant.model==='man'?'male':'female'))
    setActiveItem(filteredItems?.find(el=> variant[el.category.key] === el.animationKey))
    setActiveSetState([data[0], filteredItems])
  }

  const value: IState = {
    init,
    modelLoaded,
    dataLoaded,
    setModelLoad,
    activeSet,
    variant,
    setVariant,
    setActiveSet,
    categories,
    activeItem,
    setActiveItem,
    saveCurrentSet,
    choosenItems,
    setDataBaseBlob,
    dataBaseBlob,
    savingProcess,
    durations,
    setDurations,
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
