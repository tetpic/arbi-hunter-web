import {Dispatch, SetStateAction, createContext, useContext, useState} from 'react'
import { AppTheme,  ModalType, SnackbarType } from 'types/enums'
import ReactModal from 'react-modal'
import { SnackbarData } from 'types/types'
import { IResize, useResize } from 'components/hooks/useResize'
import { useRouter } from 'next/router'

interface IState {
  isMobile: boolean
  setIsMobile: (t: boolean) => void

  theme: AppTheme
  setTheme: Dispatch<SetStateAction<AppTheme>>

  snackbar: SnackbarData | null,
  showSnackbar: (text: string, type: SnackbarType) => void

  modal: ModalType | null
  modalArguments: any
  showModal: <T>(type: ModalType, args?: T) => void
  hideModal: () => void
  modalNonSkippable: boolean,
  snapPoints: number

  bottomSheet: ModalType | null
  bottomSheetArguments: any
  showBottomSheet: <T,>(type: ModalType, args?: T, snapPoints?: number) => void
  hideBottomSheet: () => void
  hideHeader: boolean
  setHideHeader: Dispatch<SetStateAction<boolean>>
  isNavBarActive: boolean
  setNavBarActive: Dispatch<SetStateAction<boolean>>

  isOverlayShown?: boolean
  showOverlay: () => void
  hideOverlay: () => void
  size: IResize
}


const ModalsBottomSheet: ModalType[] = []


const AppContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
  token?: string
  isMobile: boolean

}

export function AppWrapper(props: Props) {
  const [isMobile, setIsMobile] = useState<boolean>(props.isMobile)
  const router = useRouter()
  const [snackbar, setSnackbar] = useState<SnackbarData | null>(null)
  const [modal, setModal] = useState<ModalType | null>(null)
  const [modalArguments, setModalArguments] = useState<any>(null)
  const [bottomSheetArguments, setBottomSheeetArguments] = useState<any>(null)
  const [bottomSheet, setBottomSheet] = useState<ModalType | null>(null)
  const [isOverlayShown, setIsOverlayShown] = useState<boolean>(false)
  const [modalNonSkippable, setModalNonSkippable] = useState<boolean>(false)
  const [hideHeader, setHideHeader] = useState<boolean>(false)
  const [snapPoints, setSnapPoints] = useState<number>(null)
  const [isNavBarActive, setNavBarActive] = useState<boolean>(false)
  const [theme, setTheme] = useState<AppTheme>(router.query.theme as AppTheme||AppTheme.Dark)
  const size = useResize()



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

  const showBottomSheet = <T extends unknown>(type: ModalType, props?: T, snapPoints?: number) => {
    setSnapPoints(snapPoints||null)
    ReactModal.setAppElement('body')
    setBottomSheeetArguments(props)
    setBottomSheet(type)
  }

  const hideBottomSheet = () => {
    setBottomSheet(null)
  } 

  const value: IState = {
    isMobile,
    setIsMobile,

    theme,
    setTheme,

    snackbar,
    showSnackbar,

    modal,
    modalArguments,
    showModal,
    hideModal,
    modalNonSkippable,

    bottomSheet,
    bottomSheetArguments,
    showBottomSheet,
    hideBottomSheet,
    snapPoints,

    hideHeader,
    setHideHeader,
    isNavBarActive,
    setNavBarActive,

    isOverlayShown,
    showOverlay: () => {
      setIsOverlayShown(true)
    },
    hideOverlay: () => {
      setIsOverlayShown(false)
    },
    size,

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
