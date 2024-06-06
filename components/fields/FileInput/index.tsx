import { useAppContext } from 'context/state'
import { PreviewImage } from 'data/interfaces/Common'
import { ChangeEvent } from 'react'
import { SnackbarType } from 'types/enums'
import styles from './index.module.scss'
import {v4 as uuidv4} from 'uuid'
import FileRepository from 'data/repositories/FileRepository'
import useAbortController from 'components/hooks/useAbortController'


interface Props {
  setImages: (imageData: PreviewImage) => void
  getController?: (controller: AbortController) => void
  accept?: string[]
  multiple?: boolean
  name?: string
}

// debugger
// if(image.image.type === 'image/heic') {
//   const heic2any = require('heic2any')
//   await heic2any({blob:image.image, toType: 'image/png'})
//   .then((res: Blob) => {
//     debugger
//     args.onSave({image: {...image, image: res as Blob}, type})
//     props.onClose()  
//   })
// }
// else {
  

export default function FileInput(props: Props) {
  const appContext = useAppContext()
  const {getNewSignal} = useAbortController()

  const onChangeInput = async(event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const heic2any = require('heic2any')
    for(const file of files) {
      let fileToSend = file
      if(file.type === 'image/heic') {
        await heic2any({blob:file, toType: 'image/png'})
        .then((res: Blob) => {
          fileToSend = new File([res], 'name')
        })
        .catch((err: any)=> {
          appContext.showSnackbar(err.toString(), SnackbarType.error)
        })
      }
      const id = uuidv4()
      const [signal, controller] = getNewSignal(id)
      props.getController&&props.getController(controller)
      props.setImages({image: fileToSend, loaded: false, rawId: id, id})
      try{        
        FileRepository.uploadFile(fileToSend, {signal})
        .then(fl => {
          props.setImages({image: fileToSend, loaded: true, id: fl.id, rawId: id, data: fl})
        })
        .catch(err=> {
          appContext.showSnackbar(err.toString(), SnackbarType.error)
        })
      }
      catch(e) {
      }
    }
  }


  return (<input name={props.name} accept={props.accept?.length > 0?props.accept?.join(', '):'*/*'} type="file" multiple={props.multiple??true} className={styles.input} onChange={onChangeInput} />)
}