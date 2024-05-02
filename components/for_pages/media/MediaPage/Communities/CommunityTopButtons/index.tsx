import Button from 'components/ui/Button'
import { useCommunityContext } from 'context/community_state'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import styles from './index.module.scss'
import { ICreateNewCommunityModal } from 'components/modals/CreateNewCommunityModal'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  isMyComunityExist: boolean
}

export default function CommunityTopButtons(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const communityContext = useCommunityContext()

  const onCreateClick = () => {
    appContext.showModal<ICreateNewCommunityModal>(ModalType.CreateNewCommunityModal, {
      submit: communityContext.createCommunity, 
      categories: communityContext.categories})
  }
  return (
  <div className={styles.topButtons}>
    {
      !props.isMyComunityExist &&
      <Button 
      onClick={onCreateClick} className={styles.createButton}>{t('community_create')}</Button>
    }
  </div>
  )
}