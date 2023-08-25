import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from './index.module.scss'

interface Props {
  image?: string
  link?: string
  onClick?: ()=> void
}

export default function UserPic(props: Props) {
  const router = useRouter()

  const onClickHandler = () => {
    props.link&&router.push(props.link)
    props.onClick&&props.onClick()
  }

  return ( 
    <div className={styles.imageWrapper} onClick={onClickHandler}>
      <Image src={props.image?props.image: '/icons/defaultUser.png'} alt={'sefault user pic'} width={40} height={40}/>
    </div>
  )
}