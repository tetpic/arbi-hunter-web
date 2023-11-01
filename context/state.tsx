import {createContext, useContext, useState} from 'react'
import { ModalType, SnackbarType } from 'types/enums'
import ReactModal from 'react-modal'
import { SnackbarData } from 'types/types'

interface IState {
  isMobile: boolean
  setIsMobile: (t: boolean) => void

  snackbar: SnackbarData | null,
  showSnackbar: (text: string, type: SnackbarType) => void

  modal: ModalType | null
  modalArguments: any
  showModal: <T>(type: ModalType, args?: T) => void
  hideModal: () => void
  modalNonSkippable: boolean,

  bottomSheet: ModalType | null
  showBottomSheet: (type: ModalType, args?: any) => void
  hideBottomSheet: () => void

  isOverlayShown?: boolean
  showOverlay: () => void
  hideOverlay: () => void
}


const ModalsBottomSheet: ModalType[] = [

]
// const loginState$ = new Subject<boolean>()
// const loginUserState$ = new Subject<IUser | null>()
// const cartState$ = new Subject<ICart | null>()
// const currentAddressState$ = new Subject<IUserAddress | null>()

const defaultValue: IState = {
  isMobile:  false,
  setIsMobile: () => null,

  snackbar: null,
  showSnackbar: (text, type) => null,

  modal: null,
  modalArguments: null,
  hideModal: () => null,
  showModal: (type) => null,
  modalNonSkippable: false,

  bottomSheet: null,
  showBottomSheet: (type) => null,
  hideBottomSheet: () => null,

  isOverlayShown: false,
  showOverlay: () => null,
  hideOverlay: () => null,
}

const AppContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
  token?: string
  isMobile: boolean
}

export function AppWrapper(props: Props) {
  const [isMobile, setIsMobile] = useState<boolean>(props.isMobile)
  const [snackbar, setSnackbar] = useState<SnackbarData | null>(null)
  const [modal, setModal] = useState<ModalType | null>(null)
  const [modalArguments, setModalArguments] = useState<any>(null)
  const [bottomSheet, setBottomSheet] = useState<ModalType | null>(null)
  const [isOverlayShown, setIsOverlayShown] = useState<boolean>(false)
  const [modalNonSkippable, setModalNonSkippable] = useState<boolean>(false)



  const showSnackbar = (text: string, type: SnackbarType) => {
    setSnackbar({ text, type })
    setTimeout(() => {
      setSnackbar(null)
    }, 2000)
  }

  const showModal = <T extends unknown>(type: ModalType, args?: T) => {    
    if (props.isMobile && ModalsBottomSheet.includes(type)) {
      showBottomSheet(type, args)
      return
    }

    ReactModal.setAppElement('body')
    setModalArguments(args)
    setModal(type)
    if (bottomSheet) {
      hideBottomSheet()
    }
  }

  const hideModal = () => {
    if (bottomSheet) {
      hideBottomSheet()
      // return
    }
    setModal(null)
    setModalArguments(null)
  }

  const showBottomSheet = (type: ModalType, props?: any) => {
    ReactModal.setAppElement('body')
    setModalArguments(props)
    setBottomSheet(type)
  }

  const hideBottomSheet = () => {
    setBottomSheet(null)
  }

 

  const value: IState = {
    isMobile,
    setIsMobile,

    snackbar,
    showSnackbar,

    modal,
    modalArguments,
    showModal,
    hideModal,
    modalNonSkippable,

    bottomSheet,
    showBottomSheet,
    hideBottomSheet,

    isOverlayShown,
    showOverlay: () => {
      setIsOverlayShown(true)
    },
    hideOverlay: () => {
      setIsOverlayShown(false)
    },
  }


  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

/** базовый контекст для неспецифичных сущностей */
export function useAppContext() {
  return useContext(AppContext)
}
