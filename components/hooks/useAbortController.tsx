import {useRef} from 'react'

const useAbortController = () => {
  const abortController = useRef<Map<(number|string), AbortController>>(new Map)

  const getNewSignal = (signalName: number | string = 1): AbortSignal => {
    const newAbortController = new AbortController()
    const previousAbortController = abortController.current.get(signalName)
    if(previousAbortController) {
      previousAbortController.abort()
    }
    abortController.current.set(signalName, newAbortController)
    return newAbortController.signal
  }

  return {getNewSignal}
}

export default useAbortController