import { IUser } from 'data/interfaces/IUser'
import {createContext, useContext, useState} from 'react'

interface IState {
  token: string,
  user: IUser
}

const defaultValue: IState = {
  token: null,
  user: undefined
}

const UserContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
  token?: string
}

export function AppWrapper(props: Props) {
  const [token, setToken] = useState<string | null>(props.token ?? null)
  const [user, setUser] = useState<IUser | null>(null)



  const value: IState = {
   token,
   user
  }


  return (
    <UserContext.Provider value={value}>
      {props.children}
    </UserContext.Provider>
  )
}


export function useUserContext() {
  return useContext(UserContext)
}
