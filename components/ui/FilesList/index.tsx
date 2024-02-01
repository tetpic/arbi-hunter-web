import {  PreviewImage } from 'data/interfaces/Common'
import styles from './index.module.scss'
import Spinner from '../Spinner'
import classNames from 'classnames'
import CrossSvg from '@/components/svg/CrossSvg'
import { FILES } from 'types/constants'
import ReactPlayer from 'react-player'
import Image from 'next/image'
import Button from '../Button'

interface Props {
  previews: PreviewImage[],
  controller?: AbortController
  onRemove?: (rawId?: string, id?: string) => void
}

export default function FilesList(props: Props) {

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

  return (<div className={styles.imagesWrapper}>
    {props.previews.map((el, i) => {
      return (
        <div className={classNames(styles.image, (el.image?.type.includes('video')||el.data?.type === 'VIDEO')&&styles.video)}>
           {!el.loaded && <Spinner className={styles.spinner} size={24}/>}
           <Button type='button' className={styles.removeButton} onClick={()=>{props.onRemove(el.rawId, el.id.toString())}}><CrossSvg/></Button>
           {(el.image?.type.includes('image')||el.data?.type === 'IMAGE') &&
             <img key={i} src={(el?.source&&FILES+el?.source)||el.image&&URL.createObjectURL(el.image)} alt={''}/>
           }
           {(el.image?.type.includes('video')||el.data?.type === 'VIDEO') &&
             <ReactPlayer width={'100%'} height={'auto'} url={(el?.source&&FILES+el?.source)||URL.createObjectURL(el.image)} controls/>
           }
           {el.data?.type === 'BINARY' &&
           <>
            <Image key={i} src={getDefaultImage(el.image?.type||el.data.mimeType)} width={120} height={120} alt={'fileImage'}/>
            <p className={styles.fileName}>{el.image?.name||el.data.name}</p> 
           </>
           }
        </div>
      )
     })}
  </div>
)
}