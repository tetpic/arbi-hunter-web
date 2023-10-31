import styles from './index.module.scss'

import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
// import ArchiveSvg from 'components/svg/ArchiveSvg'
// import CalendarSvg from 'components/svg/CalendarSvg'
// import DoubleSvg from 'components/svg/DoubleSvg'
// import EditSvg from 'components/svg/EditSvg'
// import ShareSvg from 'components/svg/ShareSvg'
// import StarPlusSvg from 'components/svg/StarPlusSvg'
// import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import ClosingTitle from 'components/ui/ClosingTitle'
import { useCvContext } from 'context/cv_state'
import { useAppContext } from 'context/state'
import { useVacancyContext } from 'context/vacancy_state'
import { ICV } from 'data/interfaces/ICV'
import { IVacancy } from 'data/interfaces/IVacancy'
import { ModalType } from 'types/enums'
import { colors } from 'styles/variables'
import { MutableRefObject } from 'react'
import classNames from 'classnames'

interface Props {
  onClose: ()=>void
  isBottomSheet?: boolean
  outerData?: {cv?: ICV, vc?: IVacancy} 
  ref?: MutableRefObject<HTMLDivElement>
  isLast?: boolean
}

export default function CvVcOptionsModal(props: Props) {
  
  const appContext = useAppContext()
  const {cv, vc} =  props.outerData||appContext.modalArguments as {cv?: ICV, vc?: IVacancy}
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
      vacancyContext.editVacancy({...vc, published: !vc.published}, vc.id, vc.published?'active':'archive')
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
    appContext.showModal(ModalType.ConfirmModal, 
      {text: vc?'Вы действительно хотите удалить вакансию?':'Вы действительно хотите удалить резюме?',
      callback: ()=>{
        if(cv) {
          cvContext.deleteCv(cv.id)
        }
        else {
          vacancyContext.removeVacancy(vc.id, vc.published)
        }
      }
    })
  }

  const body = (
    <div className={styles.itemWrapper}>
      <p className={styles.item} onClick={archiveHandler}>{cv?.published||vc?.published?'Архивировать':'Опубликовать'}</p>
      <p className={styles.item}>Дублировать</p>
      <p className={styles.item}>Поделиться</p>
      <p className={styles.item}>Продлить и Поднять</p>
      <p className={styles.item}>Улучшить</p>
      <p className={styles.item} onClick={editHandler}>Редактировать</p>
      <p className={styles.item} onClick={removeHandler}  style={{color: colors.red}}>Удалить</p>
    </div>
  )

  if(props.outerData) {
    return (
      <div className={classNames(styles.outer, props.isLast&&styles.outer_last)} ref={props.ref}>
        {/* {title} */}
        {body}
      </div>
    )
  }

  if (props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          {/* {title} */}
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