import Image from 'next/image'
import styles from './index.module.scss'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import classNames from 'classnames'

interface Props {
  src?: string | StaticImport
  className?: string
}

export default function Banner(props: Props) {

  return (<div className={classNames(styles.root, props.className)}> 
  <Image 
  src={props.src} 
  alt={'banner'} 
  width={500} 
  height={900} 
  className={styles.bannerImage}
  />

  </div>)
}