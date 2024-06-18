import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import P from '@/components/ui/P'
import Button from '@/components/ui/Button'
import { useAppContext } from 'context/state'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'
import { ShopPages } from '@/components/for_pages/shop'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export default function BuyOpensModal(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const router = useRouter()

  const onBuyClick = () => {
    router.push({pathname: '/shop', query: {page: ShopPages.Opens}})
    props.onClose()
  }


  const body = (
    <div className={styles.root}>
     
      <P styleType={['large', 'w600', 'textCenter']}
      >
        {t('shop_contactsOpenInfo1')}
      </P>
      <Button 
      styleType={['gradient']}
      onClick={onBuyClick}
      >
        {t('shop_buyAccess')}
      </Button>
    </div>
  )

  if(props.isBottomSheet) {
    return <BottomSheetLayout>
      <BottomSheetBody>
        {body}
      </BottomSheetBody>
    </BottomSheetLayout>
  }

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}