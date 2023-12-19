import styles from './index.module.scss'

import HtmlText from 'components/ui/HtmlText'
import { IPersonalPageBlock } from 'data/interfaces/IPersonal'
import { IImage } from 'data/interfaces/Common'
import Image from 'next/image'
import { FILES } from 'types/constants'

interface Props {
  block: IPersonalPageBlock
  assets?: IImage[]
}

export default function EditableBlock(props: Props) {

  return (<div className={styles.root}> 
    <p className={styles.title}>{props.block.title}</p>
    {props.block.text &&
      <div className={styles.text}><HtmlText text={props.block.text}/></div>
    }
    {props.assets && 
      props.assets.map(el=>{
        return (
          <div className={styles.imageWrapper} key={el.id}>
            <Image 
            priority
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
  </div>)
}