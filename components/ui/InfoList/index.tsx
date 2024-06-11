import Formatter from 'utils/formatter'
import styles from './index.module.scss'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  title: string,
  titleClassName: string
  info: {fromDate: string, toDate: string, name: string, description: string}[]
}

export default function InfoList(props: Props) {
  const {t} = useTranslation()

  return (
    <div className={styles.root}>
      <p className={props.titleClassName}>{props.title}</p>
      {props.info.map((el, index)=>{
        return (
          <div className={styles.item} key={index}>
            <p className={styles.timeLine}>
              c {el.fromDate} {t('toAlt')} {el.toDate||t('toPresentAlt')} <br/>
              {Formatter.fullTimeLine([[el.fromDate, el.toDate]])}
            </p>
            <p className={styles.name}>{el.name}</p>
            <p className={styles.description}>{el.description}</p>
          </div>
        )
      })}
    </div>
  )
}