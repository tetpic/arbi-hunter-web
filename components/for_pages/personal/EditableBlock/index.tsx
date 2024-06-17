import styles from './index.module.scss'

import HtmlText from 'components/ui/HtmlText'
import { IPersonalPageBlock } from 'data/interfaces/IPersonal'
import { IFile } from 'data/interfaces/Common'
import Image from 'next/image'
import { ModalType, PersonalBlockType, Preset } from 'types/enums'
import ReactPlayer from 'react-player'
import P from '@/components/ui/P'
import { SocialSites } from '@/components/modals/AddPersonalBlockModal'
import twitter from 'images/footer/twitter_footer.svg'
import insta from 'images/footer/instagram_footer.svg'
import youtube from 'images/footer/youtube_footer.svg'
import linkedIn from 'images/footer/linkedIn_footer.svg'
import telegram from 'images/footer/tg_footer.svg'
import classNames from 'classnames'
import SwiperList from '@/components/ui/SwiperList'
import ImageHelper from 'utils/ImageHelper'
import Link from 'next/link'
import { useAppContext } from 'context/state'
import { ImageViewerModalProps } from '@/components/modals/ImageViewerModal'



interface Props {
  block: IPersonalPageBlock
  assets?: IFile[]
  isEditing?: boolean
  webView?: boolean
}

export default function EditableBlock(props: Props) {
  const appContext = useAppContext()
  const titles = (props.block.title&&props.block.type === PersonalBlockType.Columns) &&
    JSON.parse(props.block.title)

  const texts = (props.block.text&&(props.block.type === PersonalBlockType.Columns||props.block.type === PersonalBlockType.Social)) &&
    JSON.parse(props.block.text)

  const  getSocialLogo = (key: SocialSites)  => {
    switch(key) {
      case SocialSites.TWITTER:
        return <Image src={twitter} alt={'twitter'}/>
      case SocialSites.INSTAGRAM:
        return <Image src={insta} alt={'insta'}/>
      case SocialSites.YOUTUBE:
        return <Image src={youtube} alt={'youtube'}/>
      case SocialSites.TELEGRAM:
        return <Image src={telegram} alt={'telegram'}/>
      case SocialSites.LINKEDIN:
        return <Image src={linkedIn} alt={'linkedIn'}/>
    }
  }

  const showImagePreview = (src: string) => {
    if(!props.webView) {
      appContext.showModal<ImageViewerModalProps>(ModalType.ImageViewerModal, {src})
    }
  }
  
  return (
  <div className={styles.root}> 
    {(props.block.type === PersonalBlockType.Text
      ||props.block.type === PersonalBlockType.Collage
    ) &&
      <>
      <P styleType={['fs32', 'w700']} useThemeColor   >{props.block.title}</P>
      {props.block.text &&
      <div className={classNames(styles.text)} ><HtmlText text={props.block.text}/></div>
      }
      </>
    }
    {props.assets && props.block.type === PersonalBlockType.Image &&
      props.assets.map(el=>{
        return (<>
          {props.block.title &&
            <P styleType={['fs32', 'w700']} useThemeColor >{props.block.title}</P>
          }
          <div  key={el.id}>
            <div className={styles.imageWrapper}>
              <Image 
              unoptimized
              src={ImageHelper.urlFromFile(el, Preset.xlResize)}
              alt={props.block.title + ' image'} 
              width={1240}
              height={610}
              style={{objectFit:'cover', display: 'block'}}
              />
            </div>
          </div>
          
        </>)
      })
    }
    {props.block.type === PersonalBlockType.Banner &&
      <div className={classNames(styles.banner)}>
        <Image 
        unoptimized 
        src={ImageHelper.urlFromFile(props.assets[0], Preset.mdCrop)} 
        alt='' 
        width={800} 
        height={800}/>
        <div className={styles.bannerOverlay}  style={{gridArea: props.block.layout?.[0][0]}}>
          <HtmlText text={props.block.text}/>
        </div>
      </div>
    }
    {props.block.type === PersonalBlockType.Columns &&
      <SwiperList
      slideClassName={styles.columnsSlide}
      swiperClassname={styles.columnsSlider}
      wrapperClassName={styles.columnsWrapper}
      swiperProps={{
        loop: false,
        autoplay: false, 
        freeMode: {
          enabled: true,
          sticky: false,
        }
      }}
      hideNav
      hideWatchMore
      >
      <div 
      className={classNames(styles.gridContainer, styles.columnsContainer)} 
      style={{
        gridTemplateAreas: `"${(JSON.parse(props.block.layout).layout as number[][]).map(el => el.map(el=> 'o' + el).join(' ')).join('" "')}" `, 
        gridTemplateColumns: `repeat(${(JSON.parse(props.block.layout).layout as number[][])[0].length}, 1fr)`,
      }}>
        {(JSON.parse(props.block.layout).layout as number[][])[0].map((el, ind) => {
          const color = JSON.parse(props.block.layout).color[ind]
          return(
            <div className={styles.columnWrapper} style={{gridArea: `o${el}`, backgroundColor: color}}>
              {titles && titles[ind] &&
                <HtmlText text={titles[ind]}/>
              }
              {props.assets.find(img => img.id === el) &&
                <Image 
                unoptimized
                src={ImageHelper.urlFromFile(props.assets.find(img => img.id === el), Preset.mdCrop)} 
                alt={''} 
                width={600} 
                height={600} 
                className={styles.columnImage}/>
              }
              {texts && texts[ind] &&
                <HtmlText text={texts[ind]}/>
              }
            </div>
          )
        })}
      </div>
        </SwiperList>
    }
    {props.block.type === PersonalBlockType.Social &&
      <div className={classNames(styles.socialWrapper)}>
        <P styleType={['fs32', 'w700']} useThemeColor>{props.block.title}</P>
        <div className={styles.socials}>
          {(texts as {[key: string]: string}[]).map(el => Object.entries(el).map(([key, value]) => {{
            if(!Boolean(value.trim())) return null
            return <Link href={value}>{getSocialLogo(key as SocialSites)}</Link>
          } }))}
        </div>
      </div>
    }

    {props.block.type === PersonalBlockType.Html &&
      <HtmlText text={props.block.text}/>
    }

    {props.assets && props.block.type === PersonalBlockType.Collage &&
    <>
      {props.block.title && 
        <P styleType={['fs32', 'w700']} useThemeColor  >{props.block.title}</P>
      }
      <div 
      className={classNames(styles.gridContainer, styles.collageContainer)} 
      style={{
        gridTemplate: `"${(props.block.layout as number[][]).map(el => el.map(el=> 'o' + el).join(' ')).join('" 1fr "')}" 1fr / ${'1fr '.repeat((props.block.layout as number[][])[0].length)}`, 
      }}>
        {props.assets.map((el, i) => {
          return <div className={styles.collageImageWrapper} style={{gridArea: `o${el.id}`}}>              
            <Image 
            unoptimized
            onClick={()=>showImagePreview(ImageHelper.urlFromFile(el, Preset.mdResize))}
            src={ImageHelper.urlFromFile(el, Preset.mdResize)} 
            alt={''} 
            width={600} 
            height={600} 
            className={styles.collageImage}/>
          </div>
        })}
      </div>
    </>
    }

    {props.assets && props.block.type === PersonalBlockType.Gallery && <>
      {props.block.title &&
        <P styleType={['fs32', 'w700']}  useThemeColor >{props.block.title}</P>
      }
      <SwiperList
      swiperClassname={styles.columnsSlider}
      wrapperClassName={styles.columnsWrapper}
      className={styles.swiper}
      slideClassName={styles.swiperSlide}
      swiperProps={{
        loop: false,
        freeMode: false,
      }}
      hideWatchMore
      >
        {props.assets.map(el=>{
          return (
            <Image 
            unoptimized
            priority
            src={ImageHelper.urlFromFile(el, Preset.mdResize)}
            onClick={()=>showImagePreview(ImageHelper.urlFromFile(el, Preset.xlResize))}
            alt={props.block.title + ' image'} 
            width={1240}
            height={610}
            style={{objectFit:'cover', display: 'block'}}
            />
          )
        })}    
      </SwiperList>
    </>}

    {props.block.type === PersonalBlockType.Separator && 
      <div className={styles.separator}></div>
    }

    {props.block.type === PersonalBlockType.Video&&props.assets?.length > 0 &&
      props.assets.map(el=>
        <div className={classNames(styles.video, )}>
          <ReactPlayer width={'100%'} height={'100%'} playing  muted loop url={ImageHelper.urlFromSource(el.source)} controls/>
        </div>
      )
      ||
      props.block.type === PersonalBlockType.Video && props.assets.length === 0 && 
      <div className={classNames(styles.video)}>
        <ReactPlayer width={'100%'} height={'100%'}   muted loop  url={props.block.title}  controls />
      </div>
    }
    {props.block.type === PersonalBlockType.VideoText &&
      <div
      className={classNames(styles.gridContainer, styles.videoText)} 
      data-layout={props.block.layout}
      style={{
        gridTemplateAreas: `"${(props.block.layout as number[][]).map(el => el.map(el=> el).join(' ')).join('" "')}"`, 
      }}>
        <div style={{gridArea: 'video'}} className={styles.videotWrapper}>
          <ReactPlayer width={'fit-content'} height={'100%'} url={ImageHelper.urlFromSource(props.assets[0].source)} controls/>
        </div>
        <HtmlText text={props.block.text} style={{gridArea: 'text'}}/>
      </div>
    }
  </div>)
}