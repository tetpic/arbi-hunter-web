import { useResize } from 'components/hooks/useResize'
import Button from 'components/ui/Button'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import UserPic from 'components/ui/UserPic'
import { useAppContext } from 'context/state'
import { ICV } from 'data/interfaces/ICV'
import { ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

interface Props {
  cv: ICV
}

export default function CVItem({cv}: Props) {

  const appContext = useAppContext()
  const {isTabletWidth} = useResize()

  const openModal = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet(ModalType.CvOptionsModal, cv)
    }
    else {
      appContext.showModal(ModalType.CvOptionsModal, cv)
    }
  }

  return (<div className={styles.root}> 
    <div className={styles.top}>
      <UserPic className={styles.userPic}/>
      <p className={styles.position}>{cv.categories[0].name||'Должность не указана'}</p>
      <p className={styles.refreshed}>Обновлено {Formatter.formatToShortYear(cv.updatedAt)}</p>
      <ThreeDotsButton className={styles.dots} onClick={openModal}/>
    </div>
    <div className={styles.stats}>
      <p className={styles.stats_title}>Статистика за неделю</p>
      <div className={styles.stats_item}>
        <p className={styles.stats_sub}>Показы</p>
        <p className={styles.stats_count}>{cv.statsShowViews||'0'}</p>
      </div>
      <div className={styles.stats_item}>
        <p className={styles.stats_sub}>Просмотры</p>
        <p className={styles.stats_count}>{cv.totalViews||'0'}</p>
      </div>
      <div className={styles.stats_item}>
        <p className={styles.stats_sub}>Приглашения</p>
        <p className={styles.stats_count}>{cv.totalProposals||'0'}</p>
      </div>
    </div>
    <div className={styles.buttonsWrapper}>
      <Button className={styles.button}>Поднять в поиске</Button>
      <Button className={styles.buttonBlack}>456 вакансий</Button>
    </div>
  </div>)
}