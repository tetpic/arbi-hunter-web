import classNames from 'classnames'
import styles from './index.module.scss'
import { IMessage } from 'data/interfaces/IChat'
import { useAppContext } from 'context/state'
import { colors } from 'styles/variables'
import { ImageViewerModalProps } from '@/components/modals/ImageViewerModal'
import { ModalType, Preset } from 'types/enums'
import Spinner from '@/components/ui/Spinner'
import Image from 'next/image'
import ImageHelper from 'utils/ImageHelper'
import { ImageGallery } from 'react-image-grid-gallery'


interface Props {
  message:  Omit<IMessage, 'replyTo' | 'replyToId' | 'forwarded' | 'forwardedId'>
}

export default function ImageNode(props: Props) {
  const appContext = useAppContext()
  const msg = props.message

  return (<div className={styles.imagesWrapper}>
    {msg.pastedImages && msg.pastedImages.length>0&&
      // msg.pastedImages.map(el=>{
         <div className={styles.image}>
           <ImageGallery 
      imagesInfoArray={msg.pastedImages.map((el, ind) => ({
        alt: 'asset',
        caption: '',
        src:URL.createObjectURL(el)
      }))}
      columnCount={'auto'}
      columnWidth={200}
      gapSize={0}
      />
          {/* <img onClick={()=>appContext.showModal<ImageViewerModalProps>(ModalType.ImageViewerModal, {src: URL.createObjectURL(el)})} src={URL.createObjectURL(el)} /> */}
          <Spinner className={styles.spinner} size={44} color={colors.blue}/>
        </div>
      // })
    }
  {
  msg.assets 
  && msg.assets.length===1 
  && msg.assets.map((image, index)=> {
    return <div key={msg.id+index.toString()} className={classNames(styles.image, /*msg.assets.length>1&&styles.image_half*/)}>
      <Image 
      unoptimized
      width={msg.assets.length>1?200:400}
      onClick={()=>appContext.showModal<ImageViewerModalProps>(ModalType.ImageViewerModal, {src: ImageHelper.urlFromFile(image, Preset.mdResize)})} 
      src={ImageHelper.urlFromFile(image, Preset.sResize)} 
      alt={'asset'} 
      height={msg.assets.length>1?200:400} 
      />   
   
    </div>
  })}
  {msg.assets && msg.assets.length>1 &&
   <div  className={classNames(styles.image, /*msg.assets.length>1&&styles.image_half*/)}>
      <ImageGallery 
      imagesInfoArray={msg.assets.map((el, ind) => ({
        alt: 'asset',
        caption: '',
        src: ImageHelper.urlFromFile(el, Preset.sResize),
      }))}
      columnCount={'auto'}
      columnWidth={200}
      gapSize={0}
      />
    </div>

  }
  </div>)
}