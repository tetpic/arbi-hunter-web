import Image from 'next/image'
import styles from './index.module.scss'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Props {
  src?: string | StaticImport
  className?: string
  href?: string
}


/**
 * @src ?: string | StaticImport
 * @className ?: string  
 * @href ?: string
 */
export default function Banner(props: Props) {
  const router = useRouter()

  return (<div className={classNames(styles.root, props.href && styles.hovered, props.className)}> 
  {props.href&&
    <Link href={props.href} className={styles.bannerLink}/>
  }
  <Image 
  onClick={() => props.href&&router.push(props.href)}
  src={props.src} 
  alt={'banner'} 
  width={500} 
  height={900} 
  className={styles.bannerImage}
  />

  </div>)
}