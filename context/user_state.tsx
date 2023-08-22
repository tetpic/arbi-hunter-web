import { ProfileType } from 'data/interfaces/IRegistration'
import { IUser } from 'data/interfaces/IUser'
import {createContext, useContext, useState} from 'react'
import Cookies from 'js-cookie'
import { CookiesType } from 'types/enums'
import {CookiesLifeTime} from 'types/constants'
import { Subject } from 'rxjs'
import UserRepository from 'data/repository/UserRepository'

interface IState {
  token: string,
  setToken: (token: string) => void
  isLogged: boolean
  user: IUser
  profileType: ProfileType|undefined
  setProfileType: (t: ProfileType) => void,
}

const loginState$ = new Subject<boolean>()
const loginUserState$ = new Subject<IUser | null>()

const defaultValue: IState = {
  token: null,
  setToken: async (token) => null,
  isLogged: false,
  user: undefined,
  profileType: ProfileType.Employee,
  setProfileType: () => null,
}

const UserContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
  token?: string
}

export function UserWrapper(props: Props) {
  const [token, setUserToken] = useState<string | null>(props.token ?? null)
  const [user, setUser] = useState<IUser | null>(null)
  const [profileType, setProfileType] = useState(ProfileType.Employee)
  const [isLogged, setIsLogged] = useState<boolean>(false)

  const updateUser = async (newUser?: IUser): Promise<IUser> => {
    if (newUser) {
      setUser(newUser)
      return newUser
    } else {
      const data = await UserRepository.getCurrentUser()
      if (data) {
        debugger
        // setUser(data)
      }
      // setUserLoaded(true)
      // return data
    }
  }

  const setToken = (token: string) => {
    const newToken = token
    const oldToken = Cookies.get(CookiesType.accessToken) ?? null
    Cookies.set(CookiesType.accessToken, token, {
      expires: CookiesLifeTime.accessToken,
    })

    setUserToken(newToken)
    if (!oldToken && newToken) {
      loginState$.next(true)
      updateUser()
      loginUserState$.next(user)
    }
    if (oldToken && !newToken) {
      loginState$.next(false)
      loginUserState$.next(null)
    }
    setIsLogged(true)
  }

  const value: IState = {
   token,
   setToken,
   isLogged,
   user,  
   profileType,
   setProfileType,
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
