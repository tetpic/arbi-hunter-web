import styles from './index.module.scss'

import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import Button from '../Button'
import P from '../P'

interface Props {
  title?: string
  titleElement?: JSX.Element|JSX.Element[]
  children: JSX.Element|JSX.Element[]|string|null|any
  wrapperClassName?: string
}

export default function PreviewItem(props: Props) {

  return (
  <div className={styles.root}>
    <div className={styles.top}>
      {props.title &&
        <P styleType={['w600', 'large']}>{props.title}</P>
      }
      {props.titleElement}
      <Button styleType={['icon', 'backTransparent']}><ArrowRightSvg/></Button>
    </div> 
    <div className={props.wrapperClassName}>
    {props.children}
    </div>
  </div>)
}