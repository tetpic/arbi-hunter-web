import Button from 'components/ui/Button'
import { useCommunityContext } from 'context/community_state'
import { useAppContext } from 'context/state'
// import { useRouter } from 'next/router'
import { ModalType } from 'types/enums'
import styles from './index.module.scss'
import { ICreateNewCommunityModal } from 'components/modals/CreateNewCommunityModal'

interface Props {
  isMyComunityExist: boolean
}

export default function CommunityTopButtons(props: Props) {
  // const router = useRouter()
  const appContext = useAppContext()
  const communityContext = useCommunityContext()

  return (
  <div className={styles.topButtons}>
    {/* <Button className={styles.buttonBlack}>Все сообщества</Button>
    <Button className={styles.buttonBlack} onClick={()=>router.push('media/community/my')}>Моё сообщество</Button> */}
    {
      !props.isMyComunityExist &&
      <Button onClick={()=> appContext.showModal<ICreateNewCommunityModal>(ModalType.CreateNewCommunityModal, {submit: communityContext.createCommunity, categories: communityContext.categories})} className={styles.createButton}>Создать сообщество</Button>
    }
  </div>
  )
}