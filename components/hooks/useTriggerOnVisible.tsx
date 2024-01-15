import { MutableRefObject, useEffect } from 'react'

export const useTriggerOnVisible = (el: MutableRefObject<any>, onEnter: () => void, options?: {duration?: number, offset?: number})  =>  {
  
  useEffect(()=>{
    if(window !== undefined) {
      const load = async () => {
        if (typeof window !== undefined) {
          const scrollmagic = (await import('scrollmagic')).default
          const controller = new scrollmagic.Controller()
          new scrollmagic.Scene({
            triggerElement: el.current,
            duration: options?.duration || 900,
            offset: options?.offset ||-300
          })
          .on('enter', ()=> {
            onEnter()
          })
            .addTo(controller)
        }
      }
      load()
    }
  }, [])
}
