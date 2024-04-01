import styles from './index.module.scss'

import { useField } from 'formik'
import { IField } from 'types/types'
import FileInput from '../FileInput'
import { useEffect, useState } from 'react'
import { IFile, PreviewImage } from 'data/interfaces/Common'
import classNames from 'classnames'
import FilesList from '@/components/ui/FilesList'
import useTranslation from 'next-translate/useTranslation'

interface Props extends IField<any>{
  buttonName?: string|JSX.Element|JSX.Element[]
  getImages?: (files: IFile[]) => void
  initialImages?: IFile[]
  className?: string
  inputClassName?: string
  accept?: string[]
}


/**
 * @buttonName ? string
 * @getImages ? (files: IFile[]) => void
 * @initialImages ? IFile[]
 * @className ? string
 * @inputClassName ? string
 */
export default function FilesField(props: Props) {
  const {t} = useTranslation()
  const [field, meta, helpers] = useField(props as any)
  const [controller, setController] = useState<AbortController|null>(null)
  const initialImages: PreviewImage[] = props.initialImages?props.initialImages.map(el=> ({
    data: el,
    loaded: true,
    id: el.id,
    source: el.source
  }))
  :null
  const [images, setImages] = useState<Map<string,PreviewImage>>(new Map(initialImages?.map(el=> [el.id.toString(), el])))

  const removeImage = (rawId?: string, id?: string) => {
    if(controller) {
      controller.abort()
      setController(null)
    }
    const newImages = new Map(images)
    newImages.delete(rawId||id)
    setImages(newImages)
  }

  useEffect(()=>{
    helpers.setValue([...images.values()].filter(el=>el.loaded).map(el=> el.id))
    props.getImages&&props.getImages([...images.values()].filter(el=>el.loaded).map(el=> el.data))
  }, [images])

  return ( <div className={classNames(styles.imagesField, props.className)}>
    <label>
      <div className={classNames(styles.imageButton, props.inputClassName)}>{props.buttonName||t('fields_addImage')}</div>
      <FileInput accept={props.accept} getController={(c) => setController(c)}  setImages={(image) => setImages(state=>new Map([...state, [image.rawId, image]]))}/>
    </label>
    {images.size > 0 &&
      <FilesList previews={[...images.values()]} controller={controller} onRemove={removeImage}/>
    }
 </div>)
}