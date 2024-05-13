import { useRef, useState } from 'react'
import { useDetectOutsideClick } from './useDetectOutsideClick'
import {usePopper} from 'react-popper'
import {PositioningStrategy, Placement, } from '@popperjs/core'



export const useDropDown = (options?: {offset?: [number, number], position?: PositioningStrategy, placement?: Placement, flipMode?: boolean})=> {
  const dropdownRef = useRef(null)
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const {styles: popperStyles, attributes} = usePopper(referenceElement, popperElement, {
    strategy: options?.position || 'absolute',
    placement: options?.placement || 'bottom-end',
    modifiers: [
      {
        name: 'computeStyles',
        options: {
          adaptive: false,
        },
      },
      {
        name: 'flip',
        enabled:  options?.flipMode||true,
      },
      {
        name: 'offset',
        options: {
          offset: options?.offset || [16, 16],
        },
      },

    ]
  })

  const setRootRef = (ref: any) => {
    dropdownRef.current = ref
    setReferenceElement(ref)
  }

  return {isActive, setIsActive, popperStyles, setPopperElement, attributes, setRootRef}
}

