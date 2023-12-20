import {useRef} from 'react'

/**
 * @getNewSignal  (signalName?: number | string) => AbortSignal
 * @abortController MutableRefObject<Map<string | number, AbortController>>
 */
const useAbortController = () => {
  const abortController = useRef<Map<(number|string), AbortController>>(new Map)

  const getNewSignal = (signalName: number | string = 1): [AbortSignal, AbortController] => {
    const newAbortController = new AbortController()
    const previousAbortController = abortController.current.get(signalName)
    if(previousAbortController) {
      previousAbortController.abort()
    }
    abortController.current.set(signalName, newAbortController)
    return [newAbortController.signal, newAbortController]
  }

  return {getNewSignal, abortController}
}

export default useAbortController