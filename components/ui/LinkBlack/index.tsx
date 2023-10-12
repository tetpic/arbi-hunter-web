import Link from 'next/link'
import styles from './index.module.scss'

interface Props {
  href: string
  children: JSX.Element|string
}


export default function LinkBlack(props: Props) {

  return (<Link className={styles.link} href={props.href}> {props.children}</Link>)
}