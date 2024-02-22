import styles from './index.module.scss'
import Image from 'next/image'
import { IUserProfile } from 'data/interfaces/IUser'
import { FILES } from 'types/constants'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IBackground } from 'data/interfaces/IBackground'
import { usePersonalContext } from 'context/personal_state'
import { useMemo } from 'react'
import Rive from '@rive-app/react-canvas'



interface Props {
  profile?: IUserProfile
  background?: IBackground
  useDefaultImage?: boolean
}

export default function Buildings(props: Props) {
  const personalContext = usePersonalContext()

  const transportRive = useMemo(()=>{
    if(!personalContext.transport && !props.useDefaultImage) return null
    return <Rive 
    stateMachines={'State Machine 1'}  
    key={personalContext?.transport?.id||'transport'} 
    className={styles.transport} 
    src={(FILES + personalContext.transport?.image?.source)||(props.useDefaultImage&&'/rive/header_airplane.riv')} 
    animations={personalContext.transport?.riveKeys?.map(el=> el.key)}
    />
  }, [personalContext.transport])

  const weatherRive = useMemo(()=>{
    if(!personalContext.weather && !props.useDefaultImage) return null
    return <Rive 
    stateMachines={'State Machine 1'} 
    key={personalContext?.weather?.id||'weather'} 
    className={styles.rive} 
    src={(FILES + personalContext.weather?.image?.source)||(props.useDefaultImage&&'/rive/header_particles1.riv')} 
    animations={personalContext.weather?.riveKeys?.map(el=> el.key)}
    />
  }, [personalContext.weather])

  

  //todo: отрефакторить условия
  return (
  <div className={styles.imageSettings}>
    {(props.background || props.useDefaultImage) && props.profile.profileType === ProfileType.Hirer &&
      <Image className={styles.background} src={props.background?FILES + props.background.image.source:'/images/cities/newyork.png'} alt={'back'} width={770} height={300} />
      ||
      props.profile.useOwnLogo && props.profile.profileType === ProfileType.Hirer && props.profile.image &&
      <Image className={styles.background} src={FILES+ props.profile.image.source} alt={'back'} width={770} height={300} />
      ||props.profile.profileType === ProfileType.Employee && props.background &&
      <Image className={styles.background} src={FILES+ props.background.image.source} alt={'back'} width={770} height={300} />

    }
    {
      props.background && props.profile?.image && props.profile?.logo && props.profile?.profileType === ProfileType.Hirer && !props.profile.useOwnLogo &&
      <div className={styles.buildingWrapper}>
        <Image className={styles.building} src={FILES + props.profile?.image.source} width={250} height={300} alt={''}/>
        <Image 
        className={styles.logo} 
        src={FILES + props.profile?.logo.source} 
        width={60} height={60} 
        style={{top: props.profile?.image?.focalPoint?.y*100+'%', left: props.profile?.image?.focalPoint?.x*100+'%'}}
        alt={''}/>
      
      </div>
      ||
      props.profile?.profileType === ProfileType.Employee && props.profile?.useOwnLogo && props.profile?.logo &&
      <Image 
      src={FILES + props.profile?.logo.source}
      alt={''} width={370} height={370}
      className={styles.userLogo}
      />
    }

    {props.profile.profileType === ProfileType.Hirer&&weatherRive}
    {props.profile.profileType === ProfileType.Hirer&&transportRive}
  </div>
  )
}