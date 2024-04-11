import styles from './index.module.scss'

import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import { useResize } from 'components/hooks/useResize'
import LinkSvg from 'components/svg/LinkSvg'
import ShareSvg from 'components/svg/ShareSvg'
import NewsArticle from 'components/ui/NewsArticle'
import { IOptionList } from 'components/ui/OptionsList'
import { useCommunityContext } from 'context/community_state'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import { IArticle } from 'data/interfaces/IArticle'
import dynamic from 'next/dynamic'
import { ModalType, SnackbarType } from 'types/enums'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import { colors } from 'styles/variables'
import EditPencilSvg from 'components/svg/EditPencilSvg'
import { copyToClipboard } from 'utils/helpers'
import P from '@/components/ui/P'

const CreateNewCommunityArticle = dynamic(import('./CreateNewCommunityArticle'), {ssr: false})
interface Props {
}

export default function CommunityContent(props: Props) {
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()
  const communityContext = useCommunityContext()

  const isAdmin = communityContext.currentCommunity.profile?.id === userContext.currentProfile?.id

  const dotsHandler = (e: React.MouseEvent<Element, MouseEvent>, news: IArticle) => {
    e.stopPropagation()
    e.preventDefault()
    isTabletWidth 
    ?appContext.showBottomSheet(ModalType.MediaItemActionsModal, {isAdmin, news})
    :appContext.showModal(ModalType.MediaItemActionsModal, {isAdmin, news})
  }

  const getOptions = (article: IArticle):IOptionList[] => {
    if(isAdmin) {
      return [
        {
          title: 'Редактировать',
          icon: <EditPencilSvg/>,
          onClick: () => appContext.showModal(ModalType.CreateCommunityArticleModal, {article})
        },
        {title: 'Скопировать ссылку',icon: <LinkSvg/>, onClick: ()=>{
          copyToClipboard(process.env.host + '/media/article/' + article.id)
          appContext.showSnackbar('Ссылка скопирована', SnackbarType.success)
        }},
        {
          title: 'Удалить',
          icon: <TrashBasketSvg/>,           
          style: {color: colors.red},
          onClick: ()=>{
            communityContext.removeNews(article.id)
          }
        }
      ]

    } 
    else {
      return [
        {title: 'Скопировать ссылку',icon: <LinkSvg/>,},
        {title: 'Поделиться',icon: <ShareSvg/>},
        {title: 'Скрыть',icon: <CloseEyeSvg/>}
      ]
    }
  }

  return (
  <div className={styles.root}> 
      <div className={styles.infinite}>
        {isAdmin && !isTabletWidth &&
          <CreateNewCommunityArticle/>
        }
        {communityContext.communityNews&&communityContext.communityNews.size > 0 && 
        [...communityContext.communityNews.values()].map(news=> {
          return (
            <NewsArticle 
            key={news.id} 
            options={getOptions(news)} 
            titleName={communityContext.currentCommunity?.name} 
            article={news} 
            titleImg={communityContext.currentCommunity?.logo}/>
            )
          })
          ||
          <P useThemeColor className={'empty'}>Нет новостей</P>
        }
      </div>
  </div>
  )
}