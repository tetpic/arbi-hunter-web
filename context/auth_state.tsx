import { createContext, useContext, useState } from 'react'
import { useAppContext } from 'context/state'
import { SnackbarType } from 'types/enums'
import { RequestError } from 'types/types'
import useInterval from 'use-interval'
import { useRouter } from 'next/router'
import { useUserContext } from './user_state'
import { ICodeResponse, ILoginFormData, IToken } from 'data/interfaces/IRegistration'
import RegistrationRepository from 'data/repositories/RegistrationRepository'

interface IOtpError {
  show: boolean
  text?: string
}

interface IState {
  signUpSpinner: boolean
  againSpinner: boolean
  confirmSpinner: boolean
  codeRes: ICodeResponse | null
  LoginFormData: ILoginFormData | null
  remainSec: number
  setLoginFormData: (value: ILoginFormData) => void
  signUp: (values: ILoginFormData) => void
  sendCodeAgain: () => void
  confirmCode: (data: {phone?: string, code: string, email?: string}) => Promise<boolean>
  setSending: (value: boolean) => void
  setSendingAgain: (value: boolean) => void
  clear: () => void
  setRedirect: (val: string) => void
  otpError: IOtpError
  showOtpError: (show: boolean, text?: string) => void
}

const defaultValue: IState = {
  signUpSpinner: false,
  confirmSpinner: false,
  againSpinner: false,
  confirmCode: async (data: {phone?: string, code: string, email?: string}) => false,
  setSending: (value: boolean) => null,
  codeRes: null,
  LoginFormData: null,
  setLoginFormData: (values) => null,
  signUp: (values) => null,
  remainSec: 0,
  sendCodeAgain: () => null,
  setSendingAgain: (value) => null,
  clear: () => null,
  setRedirect: (val) => null,
  otpError: null,
  showOtpError: (show, text) => null
}

const AuthContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function AuthWrapper(props: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const router = useRouter()
  const [signUpSpinner, setSignUpSpinner] = useState(false)
  const [confirmSpinner, setConfirmSpinner] = useState(false)
  const [againSpinner, setAgainSpinner] = useState(false)
  const [LoginFormData, setLoginFormData] = useState<ILoginFormData | null>(null)
  const [codeRes, setCodeRes] = useState<ICodeResponse | null>(null)
  const [remainSec, setRemainSec] = useState(0)
  const [redirect, setRedirect] = useState<string>('')
  const [otpError, setOtpError] = useState<IOtpError>(null)


  useInterval(() => {
    if (remainSec > 0) {
      setRemainSec(remainSec - 1)
    }
  }, 1000)

  // Sign up step 1
  const signUp = async (values: ILoginFormData) => {
    setSignUpSpinner(true)
    setLoginFormData(values)
    const isOk = await sendCodeToPhone(values.phone)
    setSignUpSpinner(false)
    if (isOk) {
      // appContext.showModal(ModalType.signUpCode)
    }
  }

  const showOtpError = (show: boolean, text: string) => {
    setOtpError({ show, text })
    setTimeout(()=>setOtpError(null), 1000)
  }

  // Sign up step 2
  const confirmCode = async (data: {phone?: string, code: string, email?: string}): Promise<boolean> => {
    
    setConfirmSpinner(true)
    let accessToken: IToken = {accessToken: '', expiresIn: null}

    try {
      accessToken = data.phone
      ?await RegistrationRepository.phoneConfirmation({phone: data.phone, code: data.code})
      :await RegistrationRepository.emailConfirmation({email: data.email, code: data.code})
    } 
    catch (err) {
      if (err instanceof RequestError) {
        showOtpError(true, err.message)
      }
      setConfirmSpinner(false)
      return false
    }

    if (!accessToken) {
      appContext.showSnackbar('Token error', SnackbarType.error)
      setConfirmSpinner(false)
      return false
    }
    userContext.setToken(accessToken.accessToken)   
    appContext.hideModal()
    appContext.hideBottomSheet()

    setConfirmSpinner(false)
    // if (redirect) {
      
    //   await router.push(redirect)
    // }
    return true
  }

  const sendCodeToPhone = async (phone: string): Promise<boolean> => {
    let data: ICodeResponse

    try {
      data = await RegistrationRepository.login(phone)
    } catch (err) {
      if (err instanceof RequestError) {
        appContext.showSnackbar(err.message, SnackbarType.error)
      }
      return false
    }

    setCodeRes(data)
    setRemainSec(data.codeCanRetryIn ?? 0)
    return true
  }

  const sendCodeAgain = async () => {
    setAgainSpinner(true)
    if (LoginFormData?.phone) {
      await sendCodeToPhone(LoginFormData?.phone)
    }
    setAgainSpinner(false)
  }

  const clear = () => {
    setLoginFormData(null)
    setCodeRes(null)
  }

  const value: IState = {
    ...defaultValue,
    confirmCode,
    otpError,
    showOtpError,
    signUpSpinner,
    codeRes,
    signUp,
    LoginFormData,
    remainSec,
    sendCodeAgain,
    againSpinner,
    confirmSpinner,    
    clear,
    setRedirect
  }

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
