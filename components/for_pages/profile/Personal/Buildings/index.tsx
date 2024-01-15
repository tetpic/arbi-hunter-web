import styles from './index.module.scss'
import Image from 'next/image'
import { IUserProfile } from 'data/interfaces/IUser'
import { FILES } from 'types/constants'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IBackground } from 'data/interfaces/IBackground'


interface Props {
  profile?: IUserProfile
  background?: IBackground
}

export default function Buildings(props: Props) {

  

  return (
  <div className={styles.imageSettings}>

    {props.background &&
      <Image className={styles.background} src={FILES + props.background.image.source} alt={'back'} width={770} height={300} />
    }
    {
      props.background && props.profile.image && props.profile.logo && props.profile.profileType === ProfileType.Hirer &&
      <div className={styles.buildingWrapper}>
        <Image className={styles.building} src={FILES + props.profile.image.source} width={250} height={300} alt={''}/>
        <Image 
        className={styles.logo} 
        src={FILES + props.profile.logo.source} 
        width={60} height={60} 
        style={{top: props.profile.image.focalPoint.y*100+'%', left: props.profile.image.focalPoint.x*100+'%'}}
        alt={''}/>
      </div>
      ||
      props.profile.profileType === ProfileType.Employee && props.profile.useOwnLogo && props.profile.logo &&
      <Image 
      src={FILES + props.profile.logo.source}
      alt={''} width={300} height={300}
      className={styles.userLogo}
      />
    }
  </div>
  )
}