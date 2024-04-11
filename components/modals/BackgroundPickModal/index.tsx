import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from 'components/layout/Modal/ModalBody'
import { useAppContext } from 'context/state'
import { useEffect, useState } from 'react'
import { IFile, PreviewImage} from 'data/interfaces/Common'
import CrossSvg from 'components/svg/CrossSvg'
import Button from 'components/ui/Button'
import Image from 'next/image'
import BackgroundRepository from 'data/repositories/BackgroundsRepository'
import { BackgroundCategoryType, IBackground } from 'data/interfaces/IBackground'
import { useUserContext } from 'context/user_state'
import { Swiper, SwiperSlide } from 'swiper/react'
import classNames from 'classnames'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export interface IBackgroundPickModalArguments {
  withBuildPicker?: boolean
  currentBackground?: IFile
  currentBuild?: IFile
  hirerLogo?: IFile,
  onSave: (background: IBackground, building?: IBackground) => void
}


 
export default function BackgroundPickModal(props: Props) {
  
  const appContext = useAppContext()  
  const userContext = useUserContext()
  const profileType = userContext.currentProfile.profileType
  const args: IBackgroundPickModalArguments = appContext.modalArguments
  const [page, setPage] = useState<'back'|'build'>('back')
  const [currentBackground, setCurrentBackground] = useState<IFile>(args.currentBackground)
  const [currentBuild, setCurrentBuild] = useState<IFile>(args.currentBuild)
  const [backgrounds, setBackgrounds] = useState<Map<number, IBackground>>(new Map)
  const [builds, setBuilds] = useState<Map<number, IBackground>>(new Map)
  const [customBackground, setCustomBackground] = useState<PreviewImage>()

  useEffect(()=>{
    if(args.withBuildPicker) {
      BackgroundRepository.getBackground({categoryId: BackgroundCategoryType.Buildings})
      .then(res => {
        const filtered = res.filter(b => b.profileType === profileType)
        setBuilds(state => {
          filtered.forEach(b => {
            state.set(b.image.id, b)
          })
          return new Map(state)
        })
        if(!currentBuild) {
          setCurrentBuild(filtered[0].image)
        }
      })
    }
    BackgroundRepository.getBackground({categoryId: BackgroundCategoryType.Places})
    .then(res => {
      const filtered = res.filter(b => b.profileType === profileType)
      setBackgrounds(state => {
        filtered.forEach(b => {
          state.set(b.image.id, b)
        })
        return new Map(state)
      })
      if(!currentBackground) {
        setCurrentBackground(filtered[0].image)
      }
    })
    // BackgroundRepository.getBackground({profileId: userContext.currentProfile.id})
    // .then(res=> {
    //   if(!backgrounds.has(res[0]?.id) ) {
    //     setCustomBackground({data: res[0]?.image, loaded: true, id: res[0]?.id})
    //   }
    // })
  }, [])

  const onSave = () => {
    args.onSave(backgrounds.get(currentBackground?.id), builds.get(Number(currentBuild?.id)))
    props.onClose()
  }
  
  const back = (
    <div className={styles.background} data-type={'background'}>
      <Button className={styles.closeModal} onClick={props.onClose}><CrossSvg/></Button>
      <div className={styles.backgroundWrapper}>
        {currentBackground && 
          <Image 
          unoptimized
          className={styles.backgroundImage} 
          src={currentBackground&& ImageHelper.urlFromFile(currentBackground, Preset.mdResize)} 
          alt={'background'} 
          width={700} 
          height={300}/>
        }
      </div>
      {currentBuild?.source &&
      <div className={styles.buildWrapper}>        
        <Image 
        unoptimized
        className={styles.build} 
        src={currentBuild?.source && ImageHelper.urlFromFile(currentBuild, Preset.sResize)} 
        alt={'build'} 
        width={250} 
        height={300}/>
        {args.hirerLogo && 
          <Image 
          unoptimized
          className={styles.logo} 
          style={{left: currentBuild?.focalPoint.x * 100 +'%', top: currentBuild?.focalPoint.y * 100 + '%'}} 
          src={args.hirerLogo.source && ImageHelper.urlFromFile(args.hirerLogo, Preset.smallIconCrop)} 
          alt={'logo'} 
          width={60} 
          height={60}/>}
      </div>
      }
    </div>
  )

  const buildPicker = (
    <div className={classNames(styles.picker, styles.buildPicker)} data-type={'builds'}>
      <Swiper 
      slidesPerView={'auto'}
      spaceBetween={16}
      >
      {builds.size > 0 && [...builds.values()].map(b => {
        return (
          <SwiperSlide className={styles.slide} style={{width: 155}}>
            <div 
            className={classNames(styles.build, currentBuild?.id === b.image.id && styles.build_active)} 
            onClick={() => setCurrentBuild(currentBuild?.id !== b.image.id?b.image:null)}
            >
              <Image 
              unoptimized
              className={styles.buildImg} 
              src={ImageHelper.urlFromFile(b.image, Preset.xsResize)} 
              alt={b.image.source} 
              width={155} 
              height={170}
              />
              {currentBackground &&
                <Image 
                unoptimized
                className={styles.buildBack} 
                src={ImageHelper.urlFromFile(currentBackground, Preset.xsResize)} 
                width={155} 
                height={170} 
                alt={'build back'}/>
              }
            </div>
          </SwiperSlide>
        )
      })}
      </Swiper>
    </div>
  )

  const backPicker = (
    <div className={styles.picker} data-type={'places'}>
      <Swiper 
      slidesPerView={'auto'}
      spaceBetween={16}
      >
      {backgrounds.size > 0 && [...backgrounds.values()].map(b => {
        return (
          <SwiperSlide className={styles.slide} style={{width: 155}}>
            <div 
            className={classNames(styles.place, currentBackground?.id === b.image.id && styles.place_active)}
            onClick={() => setCurrentBackground(currentBackground?.id !== b.image.id?b.image:null)}
            >
              <Image
              unoptimized
               src={ImageHelper.urlFromFile( b.image, Preset.xsResize)} 
               alt={b.image.source} 
               width={155} 
               height={115}/>
            </div>
          </SwiperSlide>
        )
      })}
      </Swiper>
    </div>
  )

  const buttons = (
    <div className={styles.buttonsWrapper}>
      <Button className={styles.backButton} onClick={() => page === 'build'?setPage('back'):props.onClose()}>{page === 'build'? 'Назад': 'Отмена'}</Button>
      {args.withBuildPicker && page === 'back' &&
        <Button onClick={() => setPage('build')} className={styles.nextButton}>Далее</Button>
        ||
        <Button className={styles.nextButton} onClick={onSave}>Сохранить</Button>
      }
    </div>
  )

  return (
  <ModalLayout>
    <ModalBody>
      <div className={styles.modalWrapper}>
        {back}
        {page === 'build'? buildPicker: backPicker}   
        {buttons}   
      </div>
    </ModalBody>
  </ModalLayout>)
}