import classNames from 'classnames'
import styles from './index.module.scss'
import { IMessage } from 'data/interfaces/IChat'
import { useAppContext } from 'context/state'
import { colors } from 'styles/variables'
import { ImageViewerModalProps } from '@/components/modals/ImageViewerModal'
import { ModalType } from 'types/enums'
import Spinner from '@/components/ui/Spinner'
import Image from 'next/image'
import ImageHelper from 'utils/ImageHelper'

interface Props {
  message:  Omit<IMessage, 'replyTo' | 'replyToId' | 'forwarded' | 'forwardedId'>
}

export default function ImageNode(props: Props) {
  const appContext = useAppContext()
  const msg = props.message

  return (<div className={styles.imagesWrapper}>
    {msg.pastedImages && msg.pastedImages.length>0&&
      msg.pastedImages.map(el=>{
        return <div className={classNames(styles.image, msg.pastedImages.length>1&&styles.image_half)}>
          <img onClick={()=>appContext.showModal<ImageViewerModalProps>(ModalType.ImageViewerModal, {src: URL.createObjectURL(el)})} src={URL.createObjectURL(el)} />
          <Spinner className={styles.spinner} size={44} color={colors.blue}/>
        </div>
      })
    }
  {msg.assets&&msg.assets.length>0&&msg.assets.map(image=> {
    return <div className={classNames(styles.image, msg.assets.length>1&&styles.image_half)}>
      <Image 
      unoptimized
      onClick={()=>appContext.showModal<ImageViewerModalProps>(ModalType.ImageViewerModal, {src: ImageHelper.urlFromSource(image.source)})} 
      src={ImageHelper.urlFromSource(image.source)} 
      alt={'asset'} 
      width={msg.assets.length>1?200:400} 
      height={msg.assets.length>1?200:400} 
      />   
    </div>
  })}
  </div>)
}