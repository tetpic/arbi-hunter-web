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
}

export default function FileInput(props: Props) {
  const appContext = useAppContext()
  const {getNewSignal} = useAbortController()

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    for(const file of files) {
      const id = uuidv4()
      const [signal, controller] = getNewSignal(id)
      props.getController(controller)
      props.setImages({image: file, loaded: false, rawId: id, id})
      try{        
        FileRepository.uploadFile(file, {signal})
        .then(fl => {
          props.setImages({image: file, loaded: true, id: fl.id, rawId: id, data: fl})
        })
        .catch(err=> {
          appContext.showSnackbar(err.toString(), SnackbarType.error)
        })
      }
      catch(e) {
      }
    }
  }


  return (<input type="file" multiple={true} className={styles.input} onChange={onChangeInput} />)
}