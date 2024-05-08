import P from '@/components/ui/P'
import styles from './index.module.scss'
import classNames from 'classnames'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  progress: number[]
  className?: string
  stepsCount?: number
  type: 'cv'|'vacancy'
}

export default function Progress(props: Props) {
  const {t} = useTranslation()
  const progress = props.progress?.length === 0?0:props.progress?.length-1

  return (<div className={classNames(styles.root, props.className)}> 
    <P styleType={['medium', 'w500']} useThemeColor>{props.type === 'cv'?t('item_cvFilled'):t('item_vacancyFilled')} {progress.toString()}/{props.stepsCount||9}</P>
    <div className={styles.progressLine}>
      {new Array(props.stepsCount||9).fill(true).map((el, i) => {
        return <div className={classNames(styles.progressItem, i+1>=props.progress?.length && styles.active)}></div>
      })}
    </div>
    <P styleType={['small']} useThemeColor>{props.progress.length !== props.stepsCount? t('item_draftAlmostReady'):t('item_draftReady')}</P>
  </div>)
}