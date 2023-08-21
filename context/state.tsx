import {createContext, useContext, useState} from 'react'
import { ProfileType } from 'data/interfaces/IRegistration'
import { SnackbarType } from 'types/enums'
import { SnackbarData } from 'types/types'

interface IState {
  isMobile: boolean
  setIsMobile: (t: boolean) => void
  profileType: ProfileType|undefined
  setProfileType: (t: ProfileType) => void,
  snackbar: SnackbarData | null,
  showSnackbar: (text: string, type: SnackbarType) => void

}


// const ModalsBottomSheet: ModalType[] = [

// ]
// const loginState$ = new Subject<boolean>()
// const loginUserState$ = new Subject<IUser | null>()
// const cartState$ = new Subject<ICart | null>()
// const currentAddressState$ = new Subject<IUserAddress | null>()

const defaultValue: IState = {
  profileType: ProfileType.Employee,
  setProfileType: () => null,
  isMobile:  false,
  setIsMobile: () => null,
  snackbar: null,
  showSnackbar: (text, type) => null,
}

const AppContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
  token?: string
  isMobile: boolean
}

export function AppWrapper(props: Props) {
  const [isMobile, setIsMobile] = useState<boolean>(props.isMobile)
  const [profileType, setProfileType] = useState(ProfileType.Employee)
  const [snackbar, setSnackbar] = useState<SnackbarData | null>(null)

  const showSnackbar = (text: string, type: SnackbarType) => {
    setSnackbar({ text, type })
    setTimeout(() => {
      setSnackbar(null)
    }, 2000)
  }

  const value: IState = {
    profileType,
    setProfileType,
    isMobile,
    setIsMobile,
    snackbar,
    showSnackbar
  }


  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

/** базовый контекст для неспецифичных сущностей 
 * @profileType
 * @setProfileType
 * @isMobile
 * @setIsMobile
*/
export function useAppContext() {
  return useContext(AppContext)
}
