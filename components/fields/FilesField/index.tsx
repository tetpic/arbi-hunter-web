import styles from './index.module.scss'

import { useField } from 'formik'
import { IField } from 'types/types'
import FileInput from '../FileInput'
import { useEffect, useState } from 'react'
import { IFile, PreviewImage } from 'data/interfaces/Common'
import CrossSvg from 'components/svg/CrossSvg'
import Spinner from 'components/ui/Spinner'
import Button from 'components/ui/Button'
import { FILES } from 'types/constants'
import ReactPlayer from 'react-player'
import classNames from 'classnames'
import Image from 'next/image'

interface Props extends IField<any>{
  buttonName?: string|JSX.Element|JSX.Element[]
  getImages?: (files: IFile[]) => void
  initialImages?: IFile[]
  className?: string
  inputClassName?: string
}


/**
 * @buttonName ? string
 * @getImages ? (files: IFile[]) => void
 * @initialImages ? IFile[]
 * @className ? string
 * @inputClassName ? string
 */
export default function FilesField(props: Props) {
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

  const getDefaultImage = (mimeType: string) => {
    if(mimeType.includes('pdf')) {
      return '/icons/pdfIcon.png'
    }
    else if(mimeType.includes('doc')) {
      return '/icons/wordIcon.png'
    }
    else {
      return '/icons/fileIcon.png'
    }
  }

  useEffect(()=>{
    helpers.setValue([...images.values()].filter(el=>el.loaded).map(el=> el.id))
    props.getImages&&props.getImages([...images.values()].filter(el=>el.loaded).map(el=> el.data))
  }, [images])

  return ( <div className={classNames(styles.imagesField, props.className)}>
    <label>
      <div className={classNames(styles.imageButton, props.inputClassName)}><span>{props.buttonName||'Добавить изображение'}</span></div>
      <FileInput getController={(c) => setController(c)}  setImages={(image) => setImages(state=>new Map([...state, [image.rawId, image]]))}/>
    </label>
    {images.size > 0 &&
      <div className={styles.imagesWrapper}>
        {[...images.values()].map((el, i) => {
          return (
            <div className={classNames(styles.image, (el.image?.type.includes('video')||el.data?.type === 'VIDEO')&&styles.video)}>
               {!el.loaded && <Spinner className={styles.spinner} size={24}/>}
               <Button type='button' className={styles.removeButton} onClick={()=>removeImage(el.rawId, el.id.toString())}><CrossSvg/></Button>
               {(el.image?.type.includes('image')||el.data?.type === 'IMAGE') &&
                 <img key={i} src={(el?.source&&FILES+el?.source)||URL.createObjectURL(el.image)} alt={''}/>
               }
               {(el.image?.type.includes('video')||el.data?.type === 'VIDEO') &&
                 <ReactPlayer width={'100%'} height={'auto'} url={(el?.source&&FILES+el?.source)||URL.createObjectURL(el.image)} controls/>
               }
               {el.data?.type === 'BINARY' &&
               <>
                <Image key={i} src={getDefaultImage(el.image.type)} width={120} height={120} alt={'fileImage'}/>
                <p className={styles.fileName}>{el.image?.name}</p> 
               </>
               }
            </div>
          )
         })}
      </div>
    }
 </div>)
}