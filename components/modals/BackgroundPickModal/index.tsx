import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from 'components/layout/Modal/ModalBody'
import { useAppContext } from 'context/state'
import { useEffect, useState } from 'react'
import { IFile, PreviewImage} from 'data/interfaces/Common'
import CrossSvg from 'components/svg/CrossSvg'
import Button from 'components/ui/Button'
import Image from 'next/image'
import { FILES } from 'types/constants'
import BackgroundRepository from 'data/repositories/BackgroundsRepository'
import { BackgroundCategoryType, IBackground } from 'data/interfaces/IBackground'
import { useUserContext } from 'context/user_state'
import { Swiper, SwiperSlide } from 'swiper/react'
import classNames from 'classnames'

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
          <Image className={styles.backgroundImage} src={currentBackground&& FILES+ currentBackground.source} alt={'background'} width={700} height={300}/>
        }
      </div>
      {currentBuild?.source &&
      <div className={styles.buildWrapper}>        
        <Image className={styles.build} src={currentBuild?.source && FILES+ currentBuild?.source} alt={'build'} width={250} height={300}/>
        {args.hirerLogo && <Image className={styles.logo} style={{left: currentBuild?.focalPoint.x * 100 +'%', top: currentBuild?.focalPoint.y * 100 + '%'}} src={args.hirerLogo.source && FILES+ args.hirerLogo.source} alt={'logo'} width={60} height={60}/>}
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
              <Image className={styles.buildImg} src={FILES + b.image.source} alt={b.image.source} width={155} height={170}/>
              {currentBackground &&
                <Image className={styles.buildBack} src={FILES + currentBackground?.source} width={155} height={170} alt={'build back'}/>
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
              <Image src={FILES + b.image.source} alt={b.image.source} width={155} height={115}/>
            </div>
          </SwiperSlide>
        )
      })}
        {/* <SwiperSlide className={styles.slide} style={{width: 155}}>
          <label 
          className={styles.place}
          onClick={() => customBackground&&setCurrentBackground(customBackground.data)}
          >
            <Image src={(customBackground?.image&&URL.createObjectURL(customBackground.image))||(customBackground?.data&&FILES+customBackground.data.source)||''} alt={' '} width={155} height={115}/>

            <FileInput setImages={setCustomBackground} />
          </label>
        </SwiperSlide> */}
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