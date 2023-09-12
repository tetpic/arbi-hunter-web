import { ProfileType } from 'data/interfaces/IRegistration'
import { IUser, IUserProfile } from 'data/interfaces/IUser'
import {createContext, MutableRefObject, useContext, useEffect, useRef, useState} from 'react'
import Cookies from 'js-cookie'
import { CookiesType } from 'types/enums'
import {CookiesLifeTime} from 'types/constants'
import { Subject } from 'rxjs'
import UserRepository from 'data/repositories/UserRepository'
import CvRepository from 'data/repositories/CvRepository'
import { ICV } from 'data/interfaces/ICV'

interface IState {
  token: string,
  setToken: (token: string) => void
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
  savedCvs: ICV[],
  setSavedCvs: ()=>Promise<boolean>
  saveCv: (id: number)=> void
  removeCvfromSaved: (id: number) => void
}

const loginState$ = new Subject<boolean>()
const loginUserState$ = new Subject<IUser | null>()

const defaultValue: IState = {
  token: null,
  setToken: async (token) => null,
  isLogged: false,
  isAuth: null,
  logout: () => null,
  userLoaded: false,
  user: undefined,
  currentProfile: null,
  setCurrentProfile: (p: IUserProfile) => null,
  profileType: ProfileType.Employee,
  setProfileType: () => null,
  editCurrentProfile: async()=>null,
  savedCvs: null,
  setSavedCvs: async()=> null,
  saveCv: () => null,
  removeCvfromSaved: () => null,
}

const UserContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
  token?: string
  user?: IUser
}

export function UserWrapper(props: Props) {
  const [token, setUserToken] = useState<string | null>(props.token ?? null)
  const [user, setUser] = useState<IUser | null>(props.user)
  const [userLoaded, setUserLoaded] = useState<boolean>(false)

  const [profileType, setProfileType] = useState(ProfileType.Employee)
  const [isLogged, setIsLogged] = useState<boolean>(props.user?.isRegistrationCompleted||false)
  const [currentProfile, setCurrentProfileState] = useState<IUserProfile>(props.user?.profiles?props.user.profiles[0]:null)
  const [savedCvs, setSavedCvsState] = useState<ICV[]>([])

  
  const userRef = useRef<IUser | null>(null)
  const isAuth = useRef<boolean>(false)

  const updateUser = async (newUser?: IUser): Promise<IUser> => {
    if (newUser) {
      setUser(newUser)
      return newUser
    } else {
      
      const data = await UserRepository.getCurrentUser()
      if (data) {
        setUser(data)
        setCurrentProfileState(data.profiles[0])
      }
      setUserLoaded(true)
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

  const setCurrentProfile = (p: IUserProfile) => {

  }

  const setSavedCvs = async():Promise<boolean> => {
    if(currentProfile.profileType === ProfileType.Hirer){
      return CvRepository.getSavedByCurrentUser(currentProfile.profileType)
      .then(res=> {
        setSavedCvsState(res)
        return true
      })
      .catch(err=>{
        return false
      })
    }
    else if(currentProfile.profileType === ProfileType.Employee) {
      return CvRepository.getCVListOfCurrentUser()
      .then(res=> {
        setSavedCvsState(res)
        return true
      })
      .catch(err=>{
        return false
      })
    }
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
    Cookies.remove(CookiesType.accessToken)
    setUserToken(null)
    setIsLogged(false)
    setCurrentProfileState(null)
    setUser(null)
    loginState$.next(false)
  }

  const saveCv=(id: number) => {
    CvRepository.addCvToSaved(id, currentProfile.profileType)
    .then(res=> {
      setSavedCvs()
    })

  }

  const removeCvfromSaved = (id: number) => {
    CvRepository.removeCvFromSaved(id, currentProfile.profileType)
    .then(res=> {
      setSavedCvs()
    })
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
   savedCvs,
   setSavedCvs,
   editCurrentProfile,
   saveCv,
   removeCvfromSaved,

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
