import styles from './index.module.scss'

import HtmlText from 'components/ui/HtmlText'
import { IPersonalPageBlock } from 'data/interfaces/IPersonal'
import { IFile } from 'data/interfaces/Common'
import Image from 'next/image'
import { FILES } from 'types/constants'
import { PersonalBlockType } from 'types/enums'
import { Swiper, SwiperSlide } from 'swiper/react'
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



interface Props {
  block: IPersonalPageBlock
  assets?: IFile[]
  isEditing?: boolean
}

export default function EditableBlock(props: Props) {
  

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
  
  return (
  <div className={styles.root}> 
    {(props.block.type === PersonalBlockType.Text
      ||props.block.type === PersonalBlockType.Image
      ||props.block.type === PersonalBlockType.Gallery
      ||props.block.type === PersonalBlockType.Video
    ) &&
      <>
      <P styleType={['fs32', 'w700']} useThemeColor >{props.block.title}</P>
      {props.block.text &&
      <div className={styles.text}><HtmlText text={props.block.text}/></div>
      }
      </>
    }
    {props.assets && props.block.type === PersonalBlockType.Image &&
      props.assets.map(el=>{
        return (
          <div className={styles.imageWrapper} key={el.id}>
            <Image 
            src={FILES + el.source}
            alt={props.block.title + ' image'} 
            width={1240}
            height={610}
            style={{objectFit:'cover', display: 'block'}}
            />
          </div>
        )
      })
    }
    {props.block.type === PersonalBlockType.Banner &&
      <div className={styles.banner}>
        <Image src={FILES + props.assets[0].source} alt='' width={800} height={800}/>
        <div className={styles.bannerOverlay}  style={{gridArea: props.block.layout?.[0][0]}}>
          <HtmlText text={props.block.text}/>
        </div>

      </div>
    }
    {props.block.type === PersonalBlockType.Columns &&
      <SwiperList
      slideClassName={styles.columnsSlide}
      swiperProps={{
        loop: false,
        autoplay: false, 
        freeMode: {
          enabled: true,
          sticky: false,
        }
      }}
      hideNav
      >

      <div 
      className={styles.gridContainer} 
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
                <Image src={FILES + props.assets.find(img => img.id === el)?.source} alt={''} width={600} height={600} className={styles.columnImage}/>
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
      <div className={styles.socialWrapper}>
        <P styleType={['fs32', 'w700']} useThemeColor>{props.block.title}</P>
        <div className={styles.socials}>
          {(texts as {[key: string]: string}[]).map(el => Object.entries(el).map(([key, value]) => { {
            return <P styleType={['alignCenter', 'w500', 'large']}>{getSocialLogo(key as SocialSites)} {value}</P>
          } }))}
        </div>
      </div>
    }
    {props.block.type === PersonalBlockType.Html &&
      <HtmlText text={props.block.text}/>
    }
    {props.assets && props.block.type === PersonalBlockType.Collage &&
      <div 
      className={styles.gridContainer} 
      style={{
        gridTemplate: `"${(props.block.layout as number[][]).map(el => el.map(el=> 'o' + el).join(' ')).join('" 1fr "')}" 1fr / ${'1fr '.repeat((props.block.layout as number[][])[0].length)}`, 
      }}>
        {props.assets.map((el, i) => {
          return <div className={styles.collageImageWrapper} style={{gridArea: `o${el.id}`}}>              
            <Image src={FILES + el.source} alt={''} width={600} height={600} className={styles.collageImage}/>
          </div>
        })}
      </div>
    }
    {props.assets && props.block.type === PersonalBlockType.Gallery &&
      <Swiper 
      className={styles.swiper}
      spaceBetween={10}
      slidesPerView={'auto'}
      >
        {props.assets.map(el=>{
          return (
            <SwiperSlide className={styles.swiperSlide}>
              <Image 
              priority
              src={FILES + el.source}
              alt={props.block.title + ' image'} 
              width={1240}
              height={610}
              style={{objectFit:'cover', display: 'block'}}
              />
            </SwiperSlide>
          )
        })}        
      </Swiper>
    }
    {props.assets && props.block.type === PersonalBlockType.Video &&
      props.assets.map(el=>
        <div className={styles.video}>
          <ReactPlayer width={'fit-content'} height={'100%'} url={FILES + el.source} controls/>
        </div>
      )
    }
    {props.block.type === PersonalBlockType.VideoText &&
      <div
      className={classNames(styles.gridContainer, styles.videoText)} 
      style={{
        gridTemplateAreas: `"${(props.block.layout as number[][]).map(el => el.map(el=> el).join(' ')).join('" "')}"`, 
      }}>
        <div style={{gridArea: 'video'}}>
          <ReactPlayer width={'fit-content'} height={'100%'} url={FILES + props.assets[0].source} controls/>
        </div>
        <HtmlText text={props.block.text} style={{gridArea: 'text'}}/>
      </div>
    }
  </div>)
}