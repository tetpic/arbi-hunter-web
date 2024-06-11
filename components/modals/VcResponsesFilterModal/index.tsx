import styles from './index.module.scss'

import ResponsesFilter from 'components/for_pages/responses/VcResponses/Filter'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import Button from 'components/ui/Button'
import { useFeedbacksContext } from 'context/feedbacks_state'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: ()=>void
}

export default function VcResponsesFilterModal(props: Props) {

  const feedbacksContext = useFeedbacksContext()
  const {t} = useTranslation()

  const removeFilters = () => {
    feedbacksContext.setFilterOptions()
  }

  const backHandler = () => {
    removeFilters()
    props.onClose()
  }

  const title=(
    <div className={styles.titleWrapper}>
      <p className={styles.back} onClick={backHandler}>{t('cancel')}</p>
      <p className={styles.title}>{t('filters')}</p>
      <p className={styles.next} onClick={props.onClose}>{t('ready')}</p>
    </div>
  )

  return (
  <BottomSheetLayout>
    <BottomSheetBody>
      {title}
      <ResponsesFilter/>
      <Button onClick={removeFilters} className={styles.button}>{t('filters_reset')}</Button>
    </BottomSheetBody>
  </BottomSheetLayout>
  )
}