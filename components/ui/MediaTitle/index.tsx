import { useResize } from 'components/hooks/useResize'
import styles from './index.module.scss'
import Link from 'next/link'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'

interface Props {
  title: string|JSX.Element
  link: string
}

export default function MediaTitle(props: Props) {
  const {isTabletWidth} = useResize()

  return (
    <div className={styles.top}>
      <p className={styles.title}>{props.title}</p>
      {isTabletWidth && 
        <Link className={styles.allLink} href={'/media/page?page=categories'}>Все <ArrowRightSvg/></Link>
      }
    </div>
  )
}