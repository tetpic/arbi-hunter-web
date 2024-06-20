import styles from './index.module.scss'
import Button from '../Button'

interface Props {
  href: string
  children: JSX.Element|string
}


export default function LinkBlack(props: Props) {

  return (<Button styleType={['grey', 'whiteText']} altStyleType={['whitePurple']}  className={styles.link} href={props.href}> {props.children}</Button>)
}