import CreateNewCommunityArticle from 'components/for_pages/media/MediaPage/Community/CommunityContent/CreateNewCommunityArticle'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import Spinner from 'components/ui/Spinner'
import { useAppContext } from 'context/state'
import { IArticle } from 'data/interfaces/IArticle'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { useEffect, useState } from 'react'
import { Languages } from 'types/enums'
import styles from './index.module.scss'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: ()=>void
}

export default function CreateCommunityArticleModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as {article: IArticle}
  const [fullArticle, setFullArticle] = useState<IArticle>()
  const [loading, setLoading] = useState<boolean>(true)
  const {t} = useTranslation()

  useEffect(()=>{
    if(args) {
      ArticlesRepository.getById(args.article.id, Languages.ru)
      .then(res=> {
        setLoading(false)
        setFullArticle(res)
      })
    }
    else {
      setLoading(false)
    }
  }, [])

  return (
  <ModalLayout mobileFullScreen className={styles.modalLayout}>
    <ModalBody>
      {!loading &&
        <CreateNewCommunityArticle article={fullArticle} title={fullArticle?t('community_changePost'): t('community_createPost')} />
        ||
        loading && <Spinner size={24}/>
      }
    </ModalBody>
  </ModalLayout>
  )
}