import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import BookmarkEmptySvg from 'components/svg/BookmarkEmptySvg'
import BookmarkFilledSvg from 'components/svg/BookmarkFilledSvg'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import CrossSvg from 'components/svg/CrossSvg'
import EditSvg from 'components/svg/EditSvg'
import LinkSvg from 'components/svg/LinkSvg'
import ShareSvg from 'components/svg/ShareSvg'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import Button from 'components/ui/Button'
import { useCommunityContext } from 'context/community_state'
import { useAppContext } from 'context/state'
import { IArticle } from 'data/interfaces/IArticle'
import { useState } from 'react'
import { colors } from 'styles/variables'
import { ModalType } from 'types/enums'
import styles from './index.module.scss'

interface Props {
  onClose: ()=>void
  isBottomSheet?: boolean
}

interface ActionType {
  icon: JSX.Element, 
  title: string, 
  onClick: () => any
  color?: string
}

enum ActionItems {
  Save, Copy, Share, Hide, Edit, Delete
}


export default function MediaItemActionsModal(props: Props) {
  const appContext = useAppContext()
  const communityContext = useCommunityContext()
  const args = appContext.modalArguments as {isAdmin: boolean, news: IArticle}
  const [isSaved, setSaved] = useState<boolean>(args?.news?.isSavedByCurrentProfile||null)

  const items = (actions: ActionItems[]):ActionType[] => {
    return actions.map(action=> {
      switch(action) {
        case ActionItems.Copy:
          return {
            icon: <LinkSvg/>, 
            title: 'Скопировать сылку', 
            onClick: ()=>{}
          }
        case ActionItems.Save: 
          return {
            icon: isSaved?<BookmarkFilledSvg/>:<BookmarkEmptySvg/>,
            title: isSaved?'Удалить из избранного':'Cохранить в избранное',
            onClick: ()=>{
              communityContext.saveArticle(args.news.id)
              .then(_=>{
                setSaved(!isSaved)
              })
            }
          }
        case ActionItems.Share:
          return {
            icon: <ShareSvg/>,
            title: 'Поделиться',
            onClick: ()=>{}
          }
        case ActionItems.Hide:
          return {
            icon: <CloseEyeSvg/>,
            title: 'Скрыть',
            onClick: ()=> {}
          }
        case ActionItems.Edit: 
          return {
            icon: <EditSvg/>,
            title: 'Редактировать',
            onClick: ()=>{
              appContext.showModal(ModalType.CreateCommunityArticleModal, args.news)
            }
          }
        case ActionItems.Delete: 
          return {
            icon: <TrashBasketSvg/>,
            title: 'Удалить',
            onClick: ()=>{
              communityContext.removeNews(args.news.id)
              .then(_=> appContext.hideModal())
            },
            color: colors.red
          }
      }
    })
  }

  const top = (<div className={styles.top}>
    <p className={styles.title}>Действия с медиа</p>
    <Button onClick={props.onClose}><CrossSvg/></Button>
  </div>)

  const body = (<>
    <div className={styles.itemsWrapper}>
      {items(args.isAdmin && [ActionItems.Edit, ActionItems.Copy, ActionItems.Delete]||[ActionItems.Save, ActionItems.Copy, ActionItems.Share, ActionItems.Hide])
        .map(el=>{
          return <p style={{color: el.color}} className={styles.item} onClick={(e)=> {el.onClick()}} >{el.icon} {el.title}</p>
        })
      }
    </div>
  </>)

  if(props.isBottomSheet) {
    return (<BottomSheetLayout>
      <BottomSheetBody>
        {top}
        {body}
      </BottomSheetBody>
    </BottomSheetLayout>
    )
  }

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {top}
      {body}
    </ModalBody>
  </ModalLayout>)
}