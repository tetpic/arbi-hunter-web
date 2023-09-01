import classNames from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from './index.module.scss'

interface Props {
  image?: string
  link?: string
  onClick?: ()=> void
  className?: string
  size?: number
}

export default function UserPic(props: Props) {
  const router = useRouter()

  const onClickHandler = () => {
    props.link&&router.push(props.link)
    props.onClick&&props.onClick()
  }

  return ( 
    <div className={classNames(styles.imageWrapper, props.className)} onClick={onClickHandler}>
      <Image src={props.image?props.image: '/icons/defaultUser.png'} alt={'sefault user pic'} width={props.size||40} height={props.size||40}/>
    </div>
  )
}