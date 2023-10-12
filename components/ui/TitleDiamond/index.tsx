import classNames from 'classnames'
import styles from './index.module.scss'
import Image from 'next/image'

interface Props {
  className?: string
  title: string
}

export default function TitleDiamond(props: Props) {

  return (
  <p className={classNames(styles.title, props.className)}>
    {props.title} <Image src={'/icons/diamond.png'} alt={'diamond icon'} width={32} height={34}/>
  </p>
  )
}