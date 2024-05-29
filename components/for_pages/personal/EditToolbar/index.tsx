import styles from './index.module.scss'

import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import TextSvg from 'components/svg/TextSvg'
import PhotoBigSvg from 'components/svg/PhotoBigSvg'
import PhotoDoubleSvg from 'components/svg/PhotoDoubleSvg'
import VideoCameraSvg from 'components/svg/VideoCameraSvg'
import LocationSvg from 'components/svg/LocationSvg'
import ScaleSvg from 'components/svg/ScaleSvg'
import { ModalType, PersonalBlockType, PurchaseType } from 'types/enums'
import { IAddPersonalBlockModalProps } from 'components/modals/AddPersonalBlockModal'
import { usePersonalContext } from 'context/personal_state'
import { IPersonalPageBlock } from 'data/interfaces/IPersonal'
import { IFile } from 'data/interfaces/Common'
import useTranslation from 'next-translate/useTranslation'
import { useTariffContext } from 'context/tariff_state'
import TextAndVideoSvg from '@/components/svg/TextAndVideoSvg'
import HtmlIconSvg from '@/components/svg/HtmlIconSvg'
import LinkBigSvg from '@/components/svg/LinkBigSvg'
import CollageIconSvg from '@/components/svg/CollageIconSvg'
import BannerIconSvg from '@/components/svg/BannerIconSvg'
import ColumnsIconSvg from '@/components/svg/ColumnsIconSvg'

interface Props {
}

export default function EditToolbar(props: Props) {
  const {t}= useTranslation()
  const appContext = useAppContext()
  const personalContext = usePersonalContext()
  const tariffContext = useTariffContext()

  const isPurhchased = [...tariffContext.activeSubscriptions.values()].filter(el => el.subscription.tariff.purchaseType === PurchaseType.PersonalPage).length !== 0

  const showModal = (type: PersonalBlockType) => {   
    appContext.showModal<IAddPersonalBlockModalProps>(ModalType.AddPersonalBlockModal, {type, onSubmit: (data, images, layout)=> {
      personalContext.setBlocks(state=> new Map([...state, [state.size+1, {block: data as IPersonalPageBlock, assets: images as IFile[], layout: layout}]]))
    }})
  }
  
  const showPurchaseInfo = () => {
    appContext.showModal(ModalType.PurchaseBrandingInfoModal)
  }

  const buttons = [
    {name: t('personal_text'), free: true, icon: <TextSvg/>, type: PersonalBlockType.Text, onClick: () => showModal(PersonalBlockType.Text)},
    {name: t('personal_image'), free: true, icon: <PhotoBigSvg/>, type: PersonalBlockType.Image, onClick: () => showModal(PersonalBlockType.Image)},
    {name: t('personal_gallery'), free: false, icon: <PhotoDoubleSvg/>, type: PersonalBlockType.Gallery, onClick: () => showModal(PersonalBlockType.Gallery)},
    {name: t('personal_video'), free: true, icon: <VideoCameraSvg/>, type: PersonalBlockType.Video, onClick: () => showModal(PersonalBlockType.Video)},
    {name: t('personal_address'), free: false, icon: <LocationSvg/>, type: PersonalBlockType.Location, onClick: () => showModal(PersonalBlockType.Location)},
    {name: t('personal_divider'),free: false, icon: <ScaleSvg/>, type: PersonalBlockType.Separator, onClick: () => {
      personalContext.setBlocks(state=> new Map([...state, [state.size+1, {block: {type: PersonalBlockType.Separator}}]]))
    }},
    {name: t('personal_banner'), free: false, icon: <BannerIconSvg/>, type: PersonalBlockType.Banner, onClick: () => showModal(PersonalBlockType.Banner)},
    {name: t('personal_columns'), free: false, icon: <ColumnsIconSvg/>, type: PersonalBlockType.Columns, onClick: () => showModal(PersonalBlockType.Columns)},
    {name: t('personal_collage'), free: false, icon: <CollageIconSvg/>, type: PersonalBlockType.Collage, onClick: () => showModal(PersonalBlockType.Collage)},
    {name: t('personal_links'), free: false, icon: <LinkBigSvg/>, type: PersonalBlockType.Social, onClick: () => showModal(PersonalBlockType.Social)},
    {name: t('personal_textVideo'), free: false, icon: <TextAndVideoSvg/>, type: PersonalBlockType.VideoText, onClick: () => showModal(PersonalBlockType.VideoText)},
    {name: t('personal_html'), free: false, icon: <HtmlIconSvg/>, type: PersonalBlockType.Html, onClick: () => showModal(PersonalBlockType.Html)},
  ]

  return (<div className={styles.root}> 
    <p className={styles.title}>{t('personal_addBlock')}</p>
    <div className={styles.buttonsWrapper}>
      {buttons.map((el, i) => {
        return (
          <Button 
          styleType={[!isPurhchased&&!el.free?'grey':'gradient']} 
          className={styles.button} 
          altStyleType={['gradient']} key={i} onClick={()=>
            {
              if(!el.free && !isPurhchased) {
                showPurchaseInfo()
              }
              else {
                el.onClick()
              }
            }
          }>
            {el.icon} <p>{el.name}</p>
            {tariffContext.activeSubscriptions.size === 0 && !el.free &&
              <div className={styles.topDot}></div>
            } 
          </Button>
        )
      })}
    </div>
  </div>)
}