import { ProfileType } from 'data/interfaces/IRegistration'
import { IUser, IUserProfile } from 'data/interfaces/IUser'
import {createContext, MutableRefObject, useContext, useEffect, useRef, useState} from 'react'
import Cookies from 'js-cookie'
import { CookiesType } from 'types/enums'
import {CookiesLifeTime} from 'types/constants'
import { Subject } from 'rxjs'
import UserRepository from 'data/repositories/UserRepository'
import { useRouter } from 'next/router'

interface IState {
  token: string,
  setToken: (token: string) => Promise<boolean>
  isLogged: boolean
  isAuth: MutableRefObject<boolean>
  logout: () => void
  userLoaded: boolean
  user: IUser
  currentProfile: IUserProfile,
  setCurrentProfile: (p: IUserProfile) => void
  profileType: ProfileType|undefined
  setProfileType: (t: ProfileType) => void,
  editCurrentProfile: (d: Partial<IUserProfile>)=> Promise<boolean>
  removeCurrentProfile: () => void
  updateUser: (user?: IUser) => void
}

const loginState$ = new Subject<boolean>()
const loginUserState$ = new Subject<IUser | null>()

const defaultValue: Partial<IState> = {}

const UserContext = createContext<Partial<IState>>(defaultValue)

interface Props {
  children: React.ReactNode
  token?: string
  user?: IUser
}

export function UserWrapper(props: Props) {
  const [token, setUserToken] = useState<string | null>(props.token ?? null)
  const [user, setUser] = useState<IUser | null>(props.user)
  const [userLoaded, setUserLoaded] = useState<boolean>(false)
  const router = useRouter()

  const [profileType, setProfileType] = useState(ProfileType.Employee)
  const [isLogged, setIsLogged] = useState<boolean>(props.user?.isRegistrationCompleted||false)
  const [currentProfile, setCurrentProfileState] = useState<IUserProfile>(props.user?.profiles?props.user.profiles[0]:null)

  
  const userRef = useRef<IUser | null>(null)
  const isAuth = useRef<boolean>(false)

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

  const setCurrentProfile = (p: IUserProfile) => {

  }

  const editCurrentProfile = async(data: Partial<IUserProfile>): Promise<boolean> => {
    return UserRepository.editProfileByType(data, currentProfile.profileType)
    .then(res=> {
      setCurrentProfile(res)
      return true
    })
    .catch(err=> {
      return false
    })
  }

  const logout = () => {
    router.replace('/')
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
      UserRepository.removeCurrentUserByType(currentProfile.profileType)
      .then(_=>{
        logout()
        router.replace('/registration')
      })
    }
  }

  useEffect(() => {
    userRef.current = user
  }, [user])

  useEffect(() => { 
    if (props.token && user && props.user?.isRegistrationCompleted) {    
      setIsLogged(true)
      setCurrentProfileState(props.user.profiles && props.user.profiles.find(u => user.id === u.userId))
      isAuth.current = true
    }
  }, [user, props.user])


  useEffect(()=>{
    if(currentProfile) {
      Cookies.set(CookiesType.profileType, currentProfile.profileType)
      Cookies.set(CookiesType.language, currentProfile.countryCode)
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
   setCurrentProfile,
   isAuth,
   logout,
   editCurrentProfile,
   removeCurrentProfile,
   updateUser
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
