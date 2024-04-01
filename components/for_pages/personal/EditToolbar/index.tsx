import styles from './index.module.scss'

import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import TextSvg from 'components/svg/TextSvg'
import PhotoBigSvg from 'components/svg/PhotoBigSvg'
import PhotoDoubleSvg from 'components/svg/PhotoDoubleSvg'
import VideoCameraSvg from 'components/svg/VideoCameraSvg'
import LocationSvg from 'components/svg/LocationSvg'
import ScaleSvg from 'components/svg/ScaleSvg'
import { ModalType, PersonalBlockType } from 'types/enums'
import { IAddPersonalBlockModalProps } from 'components/modals/AddPersonalBlockModal'
import { usePersonalContext } from 'context/personal_state'
import { IPersonalPageBlock } from 'data/interfaces/IPersonal'
import { IFile } from 'data/interfaces/Common'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

export default function EditToolbar(props: Props) {
  const {t}= useTranslation()
  const appContext = useAppContext()
  const personalContext = usePersonalContext()

  const showModal = (type: PersonalBlockType) => {
    appContext.showModal<IAddPersonalBlockModalProps>(ModalType.AddPersonalBlockModal, {type, onSubmit: (data, images)=> {
      personalContext.setBlocks(state=> new Map([...state, [state.size+1, {block: data as IPersonalPageBlock, assets: images as IFile[]}]]))
    }})
  }

  const buttons = [
    {name: t('personal_text'), icon: <TextSvg/>, type: PersonalBlockType.Text, onClick: () => showModal(PersonalBlockType.Text)},
    {name: t('personal_image'), icon: <PhotoBigSvg/>, type: PersonalBlockType.Image, onClick: () => showModal(PersonalBlockType.Image)},
    {name: t('personal_gallery'), icon: <PhotoDoubleSvg/>, type: PersonalBlockType.Gallery, onClick: () => showModal(PersonalBlockType.Gallery)},
    {name: t('personal_video'), icon: <VideoCameraSvg/>, type: PersonalBlockType.Video, onClick: () => showModal(PersonalBlockType.Video)},
    {name: t('personal_address'), icon: <LocationSvg/>, type: PersonalBlockType.Location, onClick: () => showModal(PersonalBlockType.Location)},
    {name: t('personal_divider'), icon: <ScaleSvg/>, type: PersonalBlockType.Separator, onClick: () => {}},
  ]

  return (<div className={styles.root}> 
    <p className={styles.title}>{t('personal_addBlock')}</p>
    <div className={styles.buttonsWrapper}>
      {buttons.map((el, i) => {
        return (
          <Button className={styles.button} key={i} onClick={el.onClick}>
            {el.icon} <p>{el.name}</p>
          </Button>
        )
      })}
    </div>
  </div>)
}