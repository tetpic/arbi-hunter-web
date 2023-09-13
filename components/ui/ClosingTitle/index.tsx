import classNames from 'classnames'
import CrossSvg from 'components/svg/CrossSvg'
import Button from '../Button'
import styles from './index.module.scss'

interface Props {
  onClose: ()=>void
  title: string
  classNames?: {
    wrapper?: string
    title?: string
    button?: string
  }
}

export default function ClosingTitle(props: Props) {

  return (    
  <div className={classNames(styles.titleWrapper, props.classNames.wrapper)}>
    <p className={classNames(styles.title, props.classNames.title)}>{props.title}</p>
    <Button onClick={props.onClose} className={classNames(styles.buttonClose, props.classNames.button)} ><CrossSvg/></Button>
  </div>
  )
}