import { ICV } from 'data/interfaces/ICV'
import { IFolder, IFolderCreate } from 'data/interfaces/IFolder'
import FavoritesFolderRepository from 'data/repositories/FavoritesFolderRepository'
import { createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'

interface IState {
  allFolders: IFolder[]
  cvsByFolderId:Map<number, {
    cvs: ICV[];
    page: number;
    total: number;
  }[]>
  currentFolderPage: Map<number, {total: number, page: number}>
  getAllFolders: () => void 
  addCvsPageToFolder: (folderId: number, page: number) => void
  createNewFolder: (data: IFolderCreate) => Promise<IFolder>
  updateFolder: (folderId: number, data: Partial<IFolderCreate>) => Promise<IFolder>
  deleteFolder: (folderId: number) => Promise<any>
  removeCvFromFolder: (folderId: number, cvId: number) => void
  setSettings: (data: { addSavedToDefaultFolder: boolean, defaultFolderId: number}) => void
}

const LIMIT = 10

const FavoritesFolderContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function FavoritesFolderWrapper(props: Props) {
  const userContext = useUserContext()
  const [allFolders, setAllFoldersState] = useState<IFolder[]>([])
  const [cvsByFolderId, setCvsByFolderState] = useState<Map<number, {cvs:ICV[], page: number, total: number}[]>>(new Map)
  const [currentFolderPage, setCurrentFolderPageState] = useState<Map<number, {total: number, page: number}>>(new Map)


  const getAllFolders = async () => {
    try {
      const res = await FavoritesFolderRepository.getFolderList()
      const cvs = await Promise.all(res.data
        .map(el => FavoritesFolderRepository.getCvsInFolder(el.id, 1, LIMIT)
          .then(c => {
            return [el.id, [{cvs: c.data, page: c.page, total: c.total}]] as [number, {cvs:ICV[], page: number, total: number}[]]
          })
        )
      )

      setCvsByFolderState(state => {
        cvs.forEach(el => {
          state.set(el[0], el[1])
        })
        return new Map(state)
      })

      setCurrentFolderPageState(state => {
        cvs.forEach(el => {
          state.set(el[0], {total: el[1][0].total, page: 1})
        })
        return new Map(state)
      })

      setAllFoldersState(res.data)
    }
    catch (err) {
      //TODO:обработка ошибок
    }    
  }

  const addCvsPageToFolder = async (folderId: number, page: number) => {
    const cvs = await FavoritesFolderRepository.getCvsInFolder(folderId, page, LIMIT)
    setCvsByFolderState(state => {
      const folderValues = state.get(folderId)
      state.set(folderId, [...folderValues, {cvs: cvs.data, page: cvs.page, total: cvs.total}])
      return new Map(state)
    })
    setCurrentFolderPageState(state => {
      state.set(folderId, {total: cvs.total, page: cvs.page})
      return new Map(state)
    })
  }

  const createNewFolder = async (data: IFolderCreate): Promise<IFolder> => {
    const res = await FavoritesFolderRepository.createNewFolder(data)
    setAllFoldersState(state => {
      state.push(res)
      return [...state]
    })
    return res
  }

  const updateFolder = async (folderId: number, data: Partial<IFolderCreate>) => {
    const res = await FavoritesFolderRepository.updateFolder(folderId, data)
    debugger
    setAllFoldersState(state => {
      const index = state.findIndex(el => el.id === folderId)
      state[index] = res
      return [...state]
    })
    return res
  }

  const deleteFolder = async (folderId: number) => {
    const res = await FavoritesFolderRepository.deleteFolder(folderId)
    setAllFoldersState(state => {
      const index = state.findIndex(el => el.id === folderId)
      state.splice(index, 1)
      return [...state]
    })
    return res
  }

  const setSettings = (data: { addSavedToDefaultFolder: boolean, defaultFolderId: number}) => {
    FavoritesFolderRepository.setDefaultFolderSaving(userContext.currentProfile.id, data.addSavedToDefaultFolder)
    FavoritesFolderRepository.updateFolder(data.defaultFolderId, {default: true})

    userContext.editCurrentProfile({addSavedToDefaultFolder: data.addSavedToDefaultFolder})
    
    setAllFoldersState(state => {
      const _currentDefaultFolder = state.find(el => el.default)
      if(_currentDefaultFolder.id === data.defaultFolderId) {
        return [...state]
      }
      else {
        return state.map(el => el.id === data.defaultFolderId? {...el, default: true}: {...el, default: false})
      }
    })

  }

  const removeCvFromFolder = (folderId: number, cvId: number) => {
    setCvsByFolderState(state => {
      const folderValues = state.get(folderId)
      const newFolderValues = folderValues.map(el => ({...el, cvs: el.cvs.filter(cv => cv.id !== cvId)}))
      return new Map(state.set(folderId, newFolderValues))
    })
    const currentFolder = currentFolderPage.get(folderId)
    const newTotal = currentFolder.total - 1
    setCurrentFolderPageState(state => {
      state.set(folderId, {total: newTotal, page: currentFolder.page})
      return new Map(state)
    })
  }

  const value: IState = {
    allFolders,
    getAllFolders,
    cvsByFolderId,
    addCvsPageToFolder,
    currentFolderPage,
    createNewFolder,
    updateFolder,
    deleteFolder,
    removeCvFromFolder,
    setSettings
  }

  return (
    <FavoritesFolderContext.Provider value={value}>
      {props.children}
    </FavoritesFolderContext.Provider>
  )
}

export function useFavoritesFolderContext() {
  return useContext(FavoritesFolderContext)
}
