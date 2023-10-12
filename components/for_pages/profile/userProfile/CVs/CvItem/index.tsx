import { useResize } from 'components/hooks/useResize'
import Button from 'components/ui/Button'
import Statistics from 'components/ui/Statistics'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import UserPic from 'components/ui/UserPic'
import { useAppContext } from 'context/state'
import { ICV } from 'data/interfaces/ICV'
import { ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { useRef } from 'react'
import CvVcOptionsModal from 'components/modals/OptionsModal'
import styles from './index.module.scss'
import classNames from 'classnames'

interface Props {
  cv: ICV
}

export default function CVItem({cv}: Props) {

  const appContext = useAppContext()
  const {isTabletWidth} = useResize()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)

  const openModal = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet(ModalType.CvVcOptionsModal, {cv: cv})
    }
    else {
      openDropDown(!dropDown)
      // appContext.showModal(ModalType.CvVcOptionsModal, {cv: cv})
    }
  }

  return (<div className={styles.root}> 
    <div className={styles.top}>
      <UserPic className={styles.userPic}/>
      <p className={styles.position}>{cv.categories[0].name||'Должность не указана'}</p>
      <p className={styles.refreshed}>Обновлено {Formatter.formatToShortYear(cv.updatedAt)}</p>
      <ThreeDotsButton className={styles.dots} onClick={openModal}/>
      {!isTabletWidth &&
        <div ref={dropRef} className={classNames(styles.modalWrapper, dropDown&&styles.modalWrapper_active)}>
          <CvVcOptionsModal  onClose={()=>openDropDown(false)} outerData={{cv: cv}}/>
        </div>
      }
    </div>

    <Statistics 
    title={'Статистика за неделю'}
    className={styles.stats}
    items={[
      {name: 'Просмотры', count: cv.totalViews},
      {name: 'Приглашения', count: cv.totalProposals},
    ]} 
    />
    
    <div className={styles.buttonsWrapper}>
      <Button className={styles.button}>Поднять в поиске</Button>
      <Button className={styles.buttonBlack}>456 вакансий</Button>
    </div>
  </div>)
}