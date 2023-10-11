import { ICategory } from 'data/interfaces/Common'
import styles from './index.module.scss'
import Image from 'next/image'
import classNames from 'classnames'
import Formatter from 'utils/formatter'
import Button from 'components/ui/Button'
import { FILES } from 'types/constants'


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
          <div key={el.id} className={classNames(styles.item, index === 2&&styles.item_large)} style={{background: `linear-gradient(45deg, #7C5BFF  30%, #${el.color||'c73a70'} 100%)`}}>
            <p className={styles.name}>{el.name}</p>
            <Button className={styles.button} ><span style={{color: `#${el.color}`}}>Читать {el.articlesCount} {Formatter.pluralize(+el.articlesCount, 'статью', 'статьи', 'статей')}</span></Button>
            <div className={styles.imageWrapper}>
              {el.image &&
                <Image 
                src={FILES + el.image.source} 
                alt={el.name + ' image'}
                width={230}
                height={230}
                style={{objectFit:'cover', height: '100%', width: '100%', borderRadius: 16}}
                />
              }
            </div>
          </div>
        )
      })}
    </div>
    <Button className={styles.watchAll}>Смотреть все</Button>
  </div>)
}