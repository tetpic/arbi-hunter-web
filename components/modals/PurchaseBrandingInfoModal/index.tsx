import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import Image from 'next/image'
import P from '@/components/ui/P'
import Button from '@/components/ui/Button'
import { ShopPages } from '@/components/for_pages/shop'
import { useRouter } from 'next/router'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export default function PurchaseBrandingInfoModal(props: Props) {
  const router = useRouter()

  const body = (
    <div className={styles.root}>
      <div className={styles.imageWrapper}>
        <Image src={'/images/gradientLock.png'} alt={'gradientLock'} width={84} height={94}/>
      </div>
      <P styleType={['huge', 'w600', 'textCenter']}>Купите платное брендирование компании</P>
      <P styleType={['large', 'w500', 'textCenter']}>И получите доступ ко всем возможностям кастомизации вакансии!</P>
      <div className={styles.buttonsWrapper}>
        <Button styleType={['grey', 'wide']} onClick={props.onClose}>Закрыть</Button>
        <Button styleType={['gradient', 'wide']} 
        onClick={() => {
          router.push({pathname: '/shop', query: {page: ShopPages.Branding}})
          props.onClose()
        }}
        >
          Купить
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