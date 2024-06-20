import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import Image from 'next/image'
import P from '@/components/ui/P'
import Button from '@/components/ui/Button'
import { ShopPages } from '@/components/for_pages/shop'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export default function PurchaseBrandingInfoModal(props: Props) {
  const router = useRouter()
  const {t} = useTranslation()

  const body = (
    <div className={styles.root}>
      <div className={styles.imageWrapper}>
        <Image src={'/images/gradientLock.png'} alt={'gradientLock'} width={84} height={94}/>
      </div>
      <P styleType={['huge', 'w600', 'textCenter']}>{t('branding_buyDescriton1')}</P>
      <P styleType={['large', 'w500', 'textCenter']}>{t('branding_buyDescriton2')}</P>
      <div className={styles.buttonsWrapper}>
        <Button styleType={['grey', 'wide', 'whiteText']} onClick={props.onClose}>{t('close')}</Button>
        <Button styleType={['gradient', 'wide']} 
        onClick={() => {
          router.push({pathname: '/shop', query: {page: ShopPages.Branding}})
          props.onClose()
        }}
        >
          {t('buy')}
        </Button>
      </div>
    </div>
  )

  return (<ModalLayout className={styles.modalLayout}>
      <ModalBody>
        {body}  
      </ModalBody>
    </ModalLayout>
  )
}