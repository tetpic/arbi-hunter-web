import { ICV } from 'data/interfaces/ICV'
import { IFolder } from 'data/interfaces/IFolder'
import FavoritesFolderRepository from 'data/repositories/FavoritesFolderRepository'
import { createContext, useContext, useState } from 'react'

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
}

const LIMIT = 10

const FavoritesFolderContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function FavoritesFolderWrapper(props: Props) {
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

  const value: IState = {
    allFolders,
    getAllFolders,
    cvsByFolderId,
    addCvsPageToFolder,
    currentFolderPage
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
