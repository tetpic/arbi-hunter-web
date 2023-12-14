import { useAppContext } from 'context/state'
import { PreviewImage } from 'data/interfaces/Common'
import { ChangeEvent, useRef } from 'react'
import { SnackbarType } from 'types/enums'
import styles from './index.module.scss'
import {v4 as uuidv4} from 'uuid'
import FileRepository from 'data/repositories/FileRepository'


interface Props {
  setImages: (imageData: PreviewImage) => void
}

interface IAbortControllerWithId extends AbortController {
  id?: string
}

export default function FileInput(props: Props) {
  const appContext = useAppContext()
  const abortControllersRef = useRef<IAbortControllerWithId[]>()



  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    for(const file of files) {
      
      const id = uuidv4()
      const abortController = new AbortController()
      props.setImages({image: file, loaded: false, id })
      // setPreviewImages(state=> [...state, {image: file, loaded: false, id, }])
      try{        
        (abortController as IAbortControllerWithId).id = id
        FileRepository.uploadFile(file, {signal: abortController.signal})
        .then(fl => {
          // 
          props.setImages({image: file, loaded: true, id: fl.id})
        })
        .catch(err=> {
          appContext.showSnackbar(err.toString(), SnackbarType.error)
        })
      }
      catch(e) {
        // if(abortController.signal.aborted) {
        //   setPreviewImages(state=> {
        //     return [...state.filter(el => el.id !== id)]
        //   })
        // }
      }
    }
  }


  return (<input type="file" multiple={true} className={styles.input} onChange={onChangeInput} />)
}