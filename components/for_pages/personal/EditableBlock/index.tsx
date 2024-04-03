import styles from './index.module.scss'

import HtmlText from 'components/ui/HtmlText'
import { IPersonalPageBlock } from 'data/interfaces/IPersonal'
import { IFile } from 'data/interfaces/Common'
import Image from 'next/image'
import { FILES } from 'types/constants'
import { PersonalBlockType } from 'types/enums'
import { Swiper, SwiperSlide } from 'swiper/react'
import ReactPlayer from 'react-player'


interface Props {
  block: IPersonalPageBlock
  assets?: IFile[]
  isEditing?: boolean
}

export default function EditableBlock(props: Props) {

  return (<div className={styles.root}> 
    <p className={styles.title}>{props.block.title}</p>
    {props.block.text &&
      <div className={styles.text}><HtmlText text={props.block.text}/></div>
    }
    {props.assets && props.block.type === PersonalBlockType.Image &&
      props.assets.map(el=>{
        return (
          <div className={styles.imageWrapper} key={el.id}>
            <Image 
            src={FILES + el.source}
            alt={props.block.title + ' image'} 
            width={600}
            height={350}
            style={{objectFit:'cover', display: 'block'}}
            />
          </div>
        )
      })
    }
    {props.assets && props.block.type === PersonalBlockType.Collage &&
      <div className={styles.gridContainer} style={{gridTemplateAreas: `"${(props.block.layout as number[][]).map(el => el.map(el=> 'o' + el).join(' ')).join('" "')}"`, gridTemplateColumns: `repeat(${(props.block.layout as number[][])[0].length}, 1fr)`, gridTemplateRows: `repeat(${(props.block.layout as number[][]).length}, 1fr)`}}>
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
                width={300}
                height={350}
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
        <ReactPlayer width={'100%'} height={'auto'} url={FILES + el.source} controls/>
        </div>
      )
    }
  </div>)
}