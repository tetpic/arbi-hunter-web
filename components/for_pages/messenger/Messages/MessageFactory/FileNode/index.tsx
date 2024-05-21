
import DocumentSheetSvg from '@/components/svg/DocumentSheetSvg'
import styles from './index.module.scss'
import { IMessage } from 'data/interfaces/IChat'
import P from '@/components/ui/P'
import { useRouter } from 'next/router'
import ImageHelper from 'utils/ImageHelper'

interface Props {
  message: Omit<IMessage, 'replyTo' | 'replyToId' | 'forwarded' | 'forwardedId'>
}

export default function FileNode(props: Props) {
  const router = useRouter()

  const msg = props.message
  return (<div className={styles.root} > 
  {msg.assets && 
    msg.assets.map(file => {
      return <div className={styles.file} onClick={() => {
          const a = document.createElement('a')
          a.target = '_blank'
          a.href = ImageHelper.urlFromSource(file.source)
          a.download = file.name || 'file-name'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
      }}>
        <div className={styles.fileImageWrapper}>
          <DocumentSheetSvg />
        </div>
        <P styleType={['medium', 'w500']}>{file.name}</P>
      
      </div>
    })
  }


  </div>)
}