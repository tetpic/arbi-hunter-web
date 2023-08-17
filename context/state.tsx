import {createContext, useContext, useEffect, useRef, useState} from 'react'
import { useRouter } from 'next/router'
import {CookiesType, LocalStorageKey, ModalType, SnackbarType} from 'types/enums'
import {Subject} from 'rxjs'
import {useCookies} from 'react-cookie'
import CookiesUtils from 'utils/CookiesUtils'
import { ProfileType } from 'data/interfaces/IRegistration'
import { isMobile } from 'react-device-detect'

interface IState {
  isMobile: boolean
  setIsMobile: (t: boolean) => void
  profileType: ProfileType|undefined
  setProfileType: (t: ProfileType) => void,
}


// const ModalsBottomSheet: ModalType[] = [

// ]
// const loginState$ = new Subject<boolean>()
// const loginUserState$ = new Subject<IUser | null>()
// const cartState$ = new Subject<ICart | null>()
// const currentAddressState$ = new Subject<IUserAddress | null>()

const defaultValue: IState = {
  profileType: ProfileType.Emplyee,
  setProfileType: () => null,
  isMobile:  false,
  setIsMobile: () => null
}

const AppContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
  token?: string
  isMobile: boolean
}

export function AppWrapper(props: Props) {
  const [isMobile, setIsMobile] = useState<boolean>(props.isMobile)
  const [profileType, setProfileType] = useState(ProfileType.Emplyee)



  const value: IState = {
    profileType,
    setProfileType,
    isMobile,
    setIsMobile
  }


  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
