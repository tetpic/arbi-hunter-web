import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import ArchiveSvg from 'components/svg/ArchiveSvg'
import CalendarSvg from 'components/svg/CalendarSvg'
import DoubleSvg from 'components/svg/DoubleSvg'
import EditSvg from 'components/svg/EditSvg'
import ShareSvg from 'components/svg/ShareSvg'
import StarPlusSvg from 'components/svg/StarPlusSvg'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import ClosingTitle from 'components/ui/ClosingTitle'
import { useCvContext } from 'context/cv_state'
import { useAppContext } from 'context/state'
import { ICV } from 'data/interfaces/ICV'
import styles from './index.module.scss'

interface Props {
  onClose: ()=>void
}

export default function CvOptionsModal(props: Props) {
  const appContext = useAppContext()
  const cv = appContext.modalArguments as ICV
  const cvContext = useCvContext()

  const title = (<ClosingTitle title={'Действия с резюме'} onClose={props.onClose}/>
  )

  const clickHandler = (func: Function, ...args: any) => {
    func(...args)
    appContext.hideModal()
  }

  const body = (
    <div className={styles.itemWrapper}>
    <p className={styles.item} onClick={()=>clickHandler(cvContext.updateCv, cv.id, {...cv, published: !cv.published})}><ArchiveSvg/>  {cv.published?'архивировать':'опубликовать'}</p>
    <p className={styles.item}><DoubleSvg/> дублировать</p>
    <p className={styles.item}><ShareSvg/> поделиться</p>
    <p className={styles.item}><CalendarSvg/> продлить и поднять</p>
    <p className={styles.item}><StarPlusSvg/> улучшить</p>
    <p className={styles.item} onClick={()=>clickHandler(cvContext.editCv, cv)}><EditSvg/> редактировать</p>
    <p className={styles.item} onClick={()=>clickHandler(cvContext.deleteCv, cv.id)}><TrashBasketSvg/> удалить</p>
    </div>
  )

  return (<ModalLayout className={styles.layout}>
    <ModalBody>
      {title}
      {body}
    </ModalBody>
  </ModalLayout>)
}