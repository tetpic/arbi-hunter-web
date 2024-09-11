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
  straightSizes?:boolean
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
    if(props.onClick || props.link) {
      e.stopPropagation()
      e.preventDefault()    
      props.link&&router.push(props.link)
      props.onClick&&props.onClick()
    }
  }

  return ( 
    <div className={classNames(styles.imageWrapper, props.className, props.active&&styles.active, props.onClick && styles.clickable)} style={props.straightSizes&&{height: props.size, width: props.size}} onClick={onClickHandler}>
      {
      props.icon !== null && props.icon 
      ||
      <Image unoptimized priority src={props.image?props.image: '/icons/defaultUser.svg'} alt={'default user pic'} width={props.size||40} height={props.size||40}/>
      }
    </div>
  )
}