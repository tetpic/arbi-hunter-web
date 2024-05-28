import { ProfileType } from 'data/interfaces/IRegistration'
import { IUser, IUserProfile } from 'data/interfaces/IUser'
import {createContext, MutableRefObject, useContext, useEffect, useRef, useState} from 'react'
import Cookies from 'js-cookie'
import { CookiesType, SnackbarType } from 'types/enums'
import {CookiesLifeTime} from 'types/constants'
import { Subject } from 'rxjs'
import UserRepository from 'data/repositories/UserRepository'
import { useRouter } from 'next/navigation'
import { useAppContext } from './state'
import { clearObject } from 'utils/helpers'

interface IState {
  token: string,
  setToken: (token: string) => Promise<boolean>
  isLogged: boolean
  isAuth: MutableRefObject<boolean>
  logout: (noReplace?: boolean) => void
  userLoaded: boolean
  user: IUser
  currentProfile: IUserProfile,
  profileType: ProfileType|undefined
  setProfileType: (t: ProfileType) => void,
  editCurrentProfile: (d: Partial<IUserProfile>)=> Promise<IUserProfile|false>
  removeCurrentProfile: () => void
  updateUser: (user?: IUser) => Promise<IUser> 
  refreshUser: () => void
}

const loginState$ = new Subject<boolean>()
const loginUserState$ = new Subject<IUser | null>()

const defaultValue: Partial<IState> = {}

const UserContext = createContext<Partial<IState>>(defaultValue)

interface Props {
  children: React.ReactNode
  token?: string,
  user?: IUser,
  profileType?: ProfileType
}

export function UserWrapper(props: Props) {
  const appContext = useAppContext()
  const router = useRouter()

  const [token, setUserToken] = useState<string | null>(props.token ?? null)
  const [user, setUser] = useState<IUser | null>(props.user)
  const [userLoaded, setUserLoaded] = useState<boolean>(false)
  const [profileType, setProfileTypeState] = useState<ProfileType>(props.profileType||ProfileType.Employee)
  const [isLogged, setIsLogged] = useState<boolean>(props.user?.isRegistrationCompleted||false)
  const [currentProfile, setCurrentProfileState] = useState<IUserProfile>(props.user?.profiles?props.user.profiles[0]:null)
  
  const userRef = useRef<IUser | null>(null)
  const isAuth = useRef<boolean>(false)

  const setProfileType = (type: ProfileType) => {
    Cookies.set(CookiesType.profileType, type)
    setProfileTypeState(type)
  }

  const updateUser = async (newUser?: IUser): Promise<IUser> => {
    if (newUser) {
      setUser(newUser)
      return newUser
    } 
    else {
      const data = await UserRepository.getCurrentUser()
      if (data) {
        setUser(data)
        
        setCurrentProfileState(data.profiles[0])
        if(data.profiles.length === 0 && data.isRegistrationCompleted) {
          appContext.showSnackbar('Аккаунт не существует', SnackbarType.error)
          router.push('/registration')
        }
      }
      setUserLoaded(true)
      return data
    }
  }

  const setToken = async (token: string):Promise<boolean> => {
    const newToken = token
    const oldToken = Cookies.get(CookiesType.accessToken) ?? null
    Cookies.set(CookiesType.accessToken, token, {
      expires: CookiesLifeTime.accessToken,
    })
    
    setUserToken(newToken)
    if (!oldToken && newToken) {
      loginState$.next(true)
      await updateUser()
      loginUserState$.next(user)
    }
    if (oldToken && !newToken) {
      loginState$.next(false)
      loginUserState$.next(null)
    }
    setIsLogged(true)
    return true
  }

  const editCurrentProfile = async(data: Partial<IUserProfile>): Promise<IUserProfile|false> => {
    if(data.email||data.phone) {
      const dataToSend = {
        email: data.email,
        phone: data.phone, 
        firstName: data.firstName,
        lastName: data.lastName,
      }
      UserRepository.editCurrentUser(clearObject(dataToSend))
    }
   
    return UserRepository.editProfileByType(data, currentProfile?.profileType)
    .then(p=> {
      setCurrentProfileState(p)
      return p
    })
    .catch(_=> {
      return false
    })
  }

  const logout = (noReplace?: boolean) => {
    !noReplace&&router.replace('/')
    Cookies.remove(CookiesType.accessToken)
    Cookies.remove(CookiesType.profileType)
    Cookies.remove(CookiesType.language)
    setUserToken(null)
    setIsLogged(false)
    setCurrentProfileState(null)
    setUser(null)
    loginState$.next(false)
  }

  const removeCurrentProfile = () => {
    if(confirm('Удалить существующий аккаунт?')) {
      UserRepository.removeCurrentUserByType(currentProfile?.profileType)
      .then(_=>{
        logout()
        router.replace('/registration')
      })
    }
  }

  const refreshUser = () => {
    UserRepository.getCurrentUser()
    .then(res => {
      if(res) {
        setUser(res)
      }
    })
  }

  useEffect(() => {
    userRef.current = user
  }, [user])

  useEffect(() => { 
    if (props.token && user && props.user?.isRegistrationCompleted) {    
      setIsLogged(true)
      if(!currentProfile) {
        setCurrentProfileState(props.user.profiles && props.user.profiles.find(u => user.id === u.userId))
      }
      isAuth.current = true
    }
  }, [user, props.user])


  useEffect(()=>{
    if(currentProfile) {
      Cookies.set(CookiesType.profileType, currentProfile?.profileType)
      Cookies.set(CookiesType.language, user.language)
      Cookies.set(CookiesType.NEXT_LOCALE, user.language)
    }
  }, [currentProfile])

  useEffect(() => {
    if (props.token) {
      updateUser()
      .then(() => {
          setUserLoaded(true)         
      })
      .catch(() => {
        setIsLogged(false)
      })
    } 
  }, [])

  const value: IState = {
   token,
   setToken,
   isLogged,
   userLoaded,
   user,  
   profileType,
   setProfileType,
   currentProfile,
   isAuth,
   logout,
   editCurrentProfile,
   removeCurrentProfile,
   updateUser,
   refreshUser,
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
