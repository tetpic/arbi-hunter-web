import classNames from 'classnames'
import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/router'
import styles from './index.module.scss'

interface Props {
  image?: string|StaticImageData
  link?: string
  onClick?: ()=> void
  className?: string
  size?: number
  icon?: JSX.Element,
  active?: boolean
}

/**
 * @image  string|StaticImageData
 * @link  string
 * @onClick  ()=> void
 * @className  string
 * @size  number
 * @icon  JSX.Element
 */
export default function UserPic(props: Props) {
  
  const router = useRouter()

  const onClickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    
    e.stopPropagation()
    e.preventDefault()
    
    props.link&&router.push(props.link)
    props.onClick&&props.onClick()
  }

  return ( 
    <div className={classNames(styles.imageWrapper, props.className, props.active&&styles.active)} onClick={onClickHandler}>
      {
      props.icon !== null && props.icon 
      ||
      <Image src={props.image?props.image: '/icons/defaultUser.png'} alt={'sefault user pic'} width={props.size||40} height={props.size||40}/>
      }
    </div>
  )
}