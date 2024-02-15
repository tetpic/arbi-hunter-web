import P from '@/components/ui/P'
import styles from './index.module.scss'
import classNames from 'classnames'

interface Props {
  progress: number[]
  className?: string
  stepsCount?: number
}

export default function Progress(props: Props) {

  return (<div className={classNames(styles.root, props.className)}> 
    <P styleType={['medium', 'w500']}>Вакансия заполнена на {props.progress?.length.toString()}/{props.stepsCount||9}</P>
    <div className={styles.progressLine}>
      {new Array(props.stepsCount||9).fill(true).map((el, i) => {
        return <div className={classNames(styles.progressItem, i+1===props.progress?.length && styles.active)}></div>
      })}
    </div>
    <P styleType={['small']}>Черновик почти готов к публикации</P>
  </div>)
}