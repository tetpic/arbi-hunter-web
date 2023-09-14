import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
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
import { useVacancyContext } from 'context/vacancy_state'
import { ICV } from 'data/interfaces/ICV'
import { IVacancy } from 'data/interfaces/IVacancy'
import styles from './index.module.scss'

interface Props {
  onClose: ()=>void
  isBottomSheet?: boolean
}

export default function CvVcOptionsModal(props: Props) {
  
  const appContext = useAppContext()
  const {cv, vc} = appContext.modalArguments as {cv?: ICV, vc?: IVacancy}
  const cvContext = useCvContext()
  const vacancyContext = useVacancyContext()

  const title = (<ClosingTitle title={`Действия с ${cv?'резюме':'вакансией'}`} onClose={props.onClose}/>)

  const hideModal = () => {
    props.isBottomSheet
    ?appContext.hideBottomSheet()
    : appContext.hideModal()
  }

  const archiveHandler =()=> {
    if(cv) {
      cvContext.updateCv(cv.id, {...cv, published: !cv?.published})
    }
    else {
      vacancyContext.editVacancy({published: !vc.published}, vc.id, vc.published?'active':'archive')
    }
    hideModal()
  }

  const editHandler =() => {
    if(cv) {
      cvContext.editCv(cv)
    }
    else {
      vacancyContext.editVcInEditor(vc)
    }
    hideModal()
  }

  const removeHandler =()=> {
    if(cv) {
      cvContext.deleteCv(cv.id)
    }
    else {
      vacancyContext.removeVacancy(vc.id, vc.published)
    }
    hideModal()
  }

  const body = (
    <div className={styles.itemWrapper}>
      <p className={styles.item} onClick={archiveHandler}><ArchiveSvg/>{cv?.published||vc?.published?'архивировать':'опубликовать'}</p>
      <p className={styles.item}><DoubleSvg/> дублировать</p>
      <p className={styles.item}><ShareSvg/> поделиться</p>
      <p className={styles.item}><CalendarSvg/> продлить и поднять</p>
      <p className={styles.item}><StarPlusSvg/> улучшить</p>
      <p className={styles.item} onClick={editHandler}><EditSvg/> редактировать</p>
      <p className={styles.item} onClick={removeHandler}><TrashBasketSvg/> удалить</p>
    </div>
  )

  if (props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          {title}
          {body}
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }

  return (<ModalLayout className={styles.layout}>
    <ModalBody>
      {title}
      {body}
    </ModalBody>
  </ModalLayout>)
}