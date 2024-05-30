import styles from './index.module.scss'

import { IArticle } from 'data/interfaces/IArticle'
import Image from 'next/image'
import Formatter from 'utils/formatter'
import ThreeDotsButton from '../ThreeDotsButton'
import classNames from 'classnames'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import { useMediaContext } from 'context/media_state'
import UserPic from '../UserPic'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/user_state'
import { useAppContext } from 'context/state'
import { ModalType, Preset, SnackbarType } from 'types/enums'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { useResize } from 'components/hooks/useResize'
import OptionsDropDown from '../OptionsDropDown'
import OptionsList, { IOptionList } from '../OptionsList'
import { IOptionsModalProps } from 'components/modals/OptionsModal'
import Spacer from '../Spacer'
import ImageHelper from 'utils/ImageHelper'
import { IFile } from 'data/interfaces/Common'
import FavoritesButton from '../FavoritesButton'
import P from '../P'

interface Props {
  article: IArticle
  titleImg?: IFile
  titleName?: string
  withDefaultIcon?: boolean
  isOpen?: boolean
  options?: IOptionList[]
  optionsTitle?: string
  className?: string
  disableLikes?: boolean
  icon?: JSX.Element
}

/**
 * @article IArticle
 * @titleImg  string|StaticImageData
 * @titleName  string
 * @withDefaultIcon boolean
 * @isOpen boolean
 * @threeDotsHandler ?: (e: React.MouseEvent<Element, MouseEvent>, a: IArticle) => void
 * @options ?: JSX.Element|JSX.Element[]
 * @disableLikes ?: boolean
 */
export default function NewsArticle(props: Props) {
  const article = props.article
  const appContext = useAppContext()
  const userContext = useUserContext()
  const mediaContext = useMediaContext()
  const [isLiked, setIsLiked] = useState<boolean>(props.article.isLikedByCurrentProfile)
  const [likesCounter, setLikesCounter] = useState<number>(Number(props.article.likesCount))
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const router = useRouter()
  const {isTabletWidth} = useResize()


  const optionsList = <OptionsList 
  options={props.options} 
  onMouseLeave={()=>openDropDown(false)}/>

  const likeHandler = (a: IArticle)=> {
    if(!userContext.currentProfile) {
      appContext.showSnackbar('Чтобы проявить свою восхищенность новостью - пожалуйста, зарегистрируйтесь', SnackbarType.success)
      return
    }
    const article: IArticle = {...a, isLikedByCurrentProfile: isLiked} 
    mediaContext.likeArticle(article)
    .then(_=>setIsLiked(!isLiked))
  }

  const openModal = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    appContext.showBottomSheet<IOptionsModalProps>(ModalType.OptionsModal, {title: props.optionsTitle||'Действия с медиа', children: optionsList}, 230)
  }

  useEffect(()=>{
    if(isLiked !== props.article.isLikedByCurrentProfile) {
      isLiked?setLikesCounter(s => s+1):setLikesCounter(s => s-1)
    }
    else {
      setLikesCounter(Number(props.article.likesCount))
    }
  }, [isLiked])

  return ( <div className={classNames(styles.item, !props.isOpen&&styles.item_withHover, props.className)} onClick={()=> !props.isOpen&&router.push(`/media/article/${props.article.id}`)} >
    <div className={styles.top}>
      {(props.titleImg || props.withDefaultIcon ) && !props.icon &&
        <UserPic 
        className={styles.imageWrapper} 
        image={props.titleImg&&ImageHelper.urlFromFile(props.titleImg, Preset.smallIconCrop)} 
        size={40}/>
        ||
        props.icon && props.icon
      }
      <P className={styles.name} styleType={['large', 'w600']} useThemeColor>{props.titleName}</P>
      {!props.disableLikes && 
      <p className={styles.time}>{Formatter.formatDateRelative(article.createdAt)}</p>
      }
      <ThreeDotsButton onMouseEnter={()=>openDropDown(true)} onClick={openModal} className={styles.dots}/>
      {!isTabletWidth && props.options &&
        <OptionsDropDown 
        options={optionsList}
        getRef={(r) => {dropRef.current = r}} 
        active={dropDown} 
        onClose={()=>openDropDown(false)}/>   
      }
    </div>
    <div className={styles.body}>


      <P styleType={['medium', 'w500']} useThemeColor className={classNames(styles.content, props.isOpen&&styles.content_big)}>{article.name}</P>
      {article.image?.source &&
        <Image 
        unoptimized
        src={ImageHelper.urlFromFile(article.image, Preset.mdResize)}
        alt={article.name} 
        width={727} 
        height={390} 
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: 16
        }}/>
      }
      {props.isOpen && article.blocks.map(block=> {
        return (
          <div className={styles.block}>
          <P  styleType={['medium', 'w500']} useThemeColor className={classNames(styles.content, props.isOpen&&styles.content_big)}>{block.title}</P>
          <p className={styles.blockContent} dangerouslySetInnerHTML={{__html:block.body}}></p>
          {block?.image?.source && 
          <Image 
          unoptimized
          className={styles.blockImage} 
          src={ImageHelper.urlFromFile((block.image as IFile), Preset.mdResize)} 
          alt={''} 
          width={718} 
          height={360} 
          style={{objectFit: 'contain'}}
          />
          }
          </div>
        )
      })}
    </div>
      <div className={styles.stats}>
        {!props.disableLikes &&
          <P styleType={['textCenter', 'w500','medium', 'alignCenter']} useThemeColor>
          <FavoritesButton styleType={['icon', 'backTransparent']} altStyleType={['icon', 'whitePurple']} onClick={(e)=> {e.stopPropagation(); likeHandler(article)}} isActive={isLiked}/>
          {likesCounter}
          </P>
          ||
          <Spacer/>
        }
        <P styleType={['alignCenter','w500','medium']} className={styles.views}><OpenEyeSvg/> {article.totalViews}</P>
      </div>
  </div>)
}