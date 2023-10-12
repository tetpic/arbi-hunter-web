import { ICategory } from 'data/interfaces/Common'
import Image from 'next/image'
import classNames from 'classnames'
import Formatter from 'utils/formatter'
import Button from 'components/ui/Button'
// import { FILES } from 'types/constants'
import LinkBlack from 'components/ui/LinkBlack'
import nft from 'images/nft.png'
import manyNfts from 'images/many_nfts.png'
import bigS from 'images/bigS.png'
import styles from './index.module.scss'


interface Props {
  newsCompilations: ICategory[]

}

export default function MediaCompilation(props: Props) {
  const sortedByArticlesCount = props.newsCompilations.sort((a, b) => +a.articlesCount < +b.articlesCount?1:-1)

  return (<div className={styles.root}> 
    <p className={styles.title}> Подборки для вас <Image src={'/icons/diamond.png'} alt={'diamond icon'} width={32} height={34}/> </p>
    <div className={styles.content}>
      {sortedByArticlesCount.slice(0, 3).map((el, index)=> {
        return (
          <div key={el.id} className={classNames(styles.item, index === 2&&styles.item_large)} style={{background: `linear-gradient(45deg, #${index===0&&'38BFAE'||index===1&&'AC37C8'||index===2&&'653ABC'}  30%, #${index===0&&'7D5CFF'||index===1&&'7D5CFF'||index===2&&'C2396D'} 100%)`}}>
            <p className={styles.name}>{el.name}</p>
            <Button className={styles.button} ><span style={{color: `#${el.color}`}}>Читать {el.articlesCount} {Formatter.pluralize(+el.articlesCount, 'статью', 'статьи', 'статей')}</span></Button>
            <div className={styles.imageWrapper}>
              {el.image &&
                <Image 
                // src={FILES + el.image.source} 
                src={index===0&&nft||index===1&&bigS||index === 2&&manyNfts}
                alt={el.name + ' image'}
                width={index===2?428:203}
                height={index===2?338:203}
                style={{objectFit:'cover', /* height: '100%', width: '100%',*/ borderRadius: 16}}
                />
              }
            </div>
        </div>
        )
      })}
    </div>
    <LinkBlack href={'/compilations'} >Смотреть все</LinkBlack>
  </div>)
}