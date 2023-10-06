import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import BackBtn from 'components/ui/BackBtn'
import Button from 'components/ui/Button'
import UserPic from 'components/ui/UserPic'
import { useAppContext } from 'context/state'
import { IArticle } from 'data/interfaces/IArticle'
import ICommunity from 'data/interfaces/ICommunity'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FILES } from 'types/constants'
import { Languages } from 'types/enums'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

interface Props {
  onClose: ()=> void
}

export default function CommunityNewsViewModal(props: Props) {
  const appContext = useAppContext()
  const [item, community, isAdmin] = appContext.modalArguments as [IArticle, ICommunity, boolean]
  const [article, setArticle] = useState<IArticle>()
  const [isLoading, setLoading] = useState<boolean>(true)

  useEffect(()=>{
    ArticlesRepository.getById(item.id, Languages.ru)
    .then(res=> {
      setLoading(false)
      setArticle(res)
    })
  }, [])

  const navigation = (<div className={styles.navigation}>
    <BackBtn className={styles.backBtn} onClick={props.onClose} bgColor={'transparent'}/>
  </div>)



  const body = (<>
    <div className={styles.top}>
      <UserPic size={46} className={styles.userPic} image={community.logo && FILES + community.logo.source}/>
      <p className={styles.commName}>{item.community.name}</p>
      <p className={styles.published}>{Formatter.formatDateRelative(item.createdAt)}</p>
      {!isAdmin &&
        <Button className={styles.yellowButton}>Подписаться</Button>
      }
    </div>
    <div className={styles.content}>
      <p className={styles.title}>{item.name}</p>
      <div className={styles.blocks}>
        {article && article.blocks.length > 0 &&
          article.blocks.map((block, index)=> {
            if(block.body) {
              return (<div key={index} className={styles.text} dangerouslySetInnerHTML={{__html: block.body}}></div>)
            }
          })
        } 
        <div className={styles.imagesWrapper}>
        {article&&article.images&&article.images.map(image=> {
          return(
            <div key={image.id} className={styles.image} style={{width: article.images.length > 1?'50%': '100%'}}>
              <Image src={FILES+ image.source} alt={'article Image'} layout="fill" objectFit='cover' />
            </div>
          )
        })}
        </div>
      </div>
    </div>
    <div className={styles.stats}>

    </div>
  </>)

  return (<ModalLayout className={styles.layout} mobileFullScreen>
    <ModalBody>
      {navigation}
      {body}
    </ModalBody>
  </ModalLayout>)
}