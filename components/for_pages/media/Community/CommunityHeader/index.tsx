import UsersSvg from 'components/svg/UsersSvg'
import Button from 'components/ui/Button'
import UserPic from 'components/ui/UserPic'
import { useMediaContext } from 'context/media_state'
import { IImage } from 'data/interfaces/Common'
import Image from 'next/image'
import { useState } from 'react'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

interface Props {
  image: IImage
  logo: IImage
  id: number
  name: string
  members: number
  subscribed: boolean
}

export default function CommunityHeader(props: Props) {
  const mediaContext = useMediaContext()
  const [isLoading, setIsLoading] = useState<boolean>()

  const buttonHandler = async () => {
    setIsLoading(true)
    await mediaContext.communitySubsription(props.id, props.subscribed)
    setIsLoading(false)
  }

  return (<div className={styles.root}> 
    <div className={styles.background}>
      {props.image &&
        <Image src={FILES+ props.image.source} alt={props.name + ' background'} fill/>
      }
    </div>
    <div className={styles.content}>
      <UserPic className={styles.userPic} image={props.logo&&FILES + props.logo.source} size={/*props.image?114:80*/ 144}/>
      <p className={styles.name}>{props.name}</p>
      <p className={styles.members}>
        <UsersSvg/>
        {Formatter.formatNumber(props.members)} участников
      </p>
      <Button 
      isProcess={isLoading}
      disabled={isLoading}
      className={styles.button}
      onClick={buttonHandler} 
      >
        {props.subscribed?'Подписаться': 'Отписаться'}
      </Button>
    </div>


  </div>)
}