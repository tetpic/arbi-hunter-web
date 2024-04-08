import styles from './index.module.scss'

import { useAppContext } from 'context/state'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import BackTextButton from 'components/ui/BackTextButton'
import { PersonalBlockType } from 'types/enums'
import { IPersonalPageBlock } from 'data/interfaces/IPersonal'
import { Form, FormikProvider, useFormik } from 'formik'
import InputField from 'components/fields/InputField'
import RichTextField from 'components/fields/RichTextField'
import Button from 'components/ui/Button'
import FilesField from 'components/fields/FilesField'
import { IFile } from 'data/interfaces/Common'
import {  useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import Image from 'next/image'
import { FILES } from 'types/constants'
import classNames from 'classnames'
import DotSvg from '@/components/svg/DotSvg'
import HtmlText from '@/components/ui/HtmlText'
import { colors } from 'styles/variables'
import TextAreaField from '@/components/fields/TextAreaField'
import ReactPlayer from 'react-player'
import CollageLayoutSvg from '@/components/svg/CollageLayoutSvg'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export enum SocialSites {
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  TELEGRAM='telegram',
  LINKEDIN = 'linkedin',
}

export interface IAddPersonalBlockModalProps {
  type: PersonalBlockType
  onSubmit: (data: Partial<IPersonalPageBlock>, images?: IFile[], layout?: any) => void
  initialData?: {block: Partial<IPersonalPageBlock>, assets: IFile[]}
}
/**
 * чтобы понять что происходит в этой модалке, я объясню...
 * с бэка приходит personalPage, в ней есть массив с блоками, в каждом блоке есть массив с айдишниками изображений, но нет самих объектов изображений
 * потому что они лежат в отдельном массиве. поэтому чтобы все ок работало, приходится получать массив картинок в одном месте, и подставлять их в этом
 */

export default function AddPersonalBlockModal(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const args = appContext.modalArguments as IAddPersonalBlockModalProps
  const [images, setImages] = useState<Map<number, IFile>>(new Map(args.initialData&&args.initialData.assets.map((el, ind)=> [ind+1, el]))||new Map)
  const [layout, setLayout] = useState<(number|string)[][]>()

  useEffect(()=>{
    if(!args.initialData || !args.initialData.block.layout) return
    if(args.type === PersonalBlockType.VideoText||args.type === PersonalBlockType.Banner||args.type === PersonalBlockType.Columns) {
      setLayout(args.initialData.block.layout)
      return
    }
    const result =  args.initialData.block.layout.map(el=> el.map(e=> {
      return args.initialData.block.assets.indexOf(Number(e))+1
    }))
    setLayout(result)
  }, [args.initialData?.block?.layout])

 
  const submit = (data: Partial<IPersonalPageBlock>) => {
    const submitData = {
      ...data
    }
    layout && (submitData.layout = (layout.map(el => el.map(e => images.get(Number(e))?.id||e))))
    data.texts.length > 0 && (submitData.text = JSON.stringify(data.texts))
    data.titles.length > 0 && (submitData.title = JSON.stringify(data.titles))
    data.assetsList.length > 0 && (submitData.assets = data.assetsList.flat(1))
    delete submitData.assetsList 
    delete submitData.titles
    delete submitData.texts
    args.onSubmit(submitData, [...images.values()])
    appContext.hideModal()
  }

  const getInitialTexts = () => {
    if(args.type===PersonalBlockType.Social
      ||
      args.type === PersonalBlockType.Columns
    ){
      return JSON.parse(args.initialData?.block?.text)
    }
  }

  const getInitialTitles = () => {
    if(args.type === PersonalBlockType.Columns) {
      return JSON.parse(args.initialData?.block?.title)
    }
  }

  const formik = useFormik<Partial<IPersonalPageBlock>>({
    initialValues: {
      type: args.type,
      text: args.initialData?.block?.text||'',
      title: args.initialData?.block?.title||'',
      titles: getInitialTitles()||[],
      texts: getInitialTexts()||[],
      assets: args.initialData?.block?.assets||[],
      assetsList: [],
    },
    onSubmit: submit
  })

  const imagesLayoutArray = [
    '[[1,2,2],[1,3,3]]', 
    '[[1,2,3],[4,2,5]]', 
    '[[1,2,3],[1,4,5]]',
    '[[1,2,3],[4,5,6]]',
    '[[1,2,3],[1,2,4]]',
    '[[1,2],[3,2]]',
    '[[1,2,3],[4,2,3]]',
    '[[1,2,3]]',
    '[[1,2],[1,3]]',
    '[[1,2,2,3]]'
  ]

  const textPositionsArray = [
    '1/1', 
    '1/2', 
    '1/3',
    '2/1',
    '2/2',
    '2/3',
    '3/1',
    '3/2',
    '3/3',
  ]


  const titleInput = <InputField placeholder={t('personal_header')} styleType={'default'} color={'default'} name={'title'}/>

  const richText = <RichTextField hideButtons={{helpers: true}} name='text'/>

  const layoutGrid = <div className={styles.layoutGrid}>
    <P styleType={['large', 'w500']}>{t('constructor_chooseImageLayout')}</P>
    <div className={styles.buttonsWrapper}>
      {imagesLayoutArray.map((el, i) => {
        const isActive = JSON.stringify(layout) === el
        return (
          <Button 
          type='button' 
          styleType={['icon', isActive?'gradient':'black']} 
          className={isActive?styles.layoutButtonActive:''}
          onClick={()=>setLayout(JSON.parse(el))}>
            <CollageLayoutSvg type={i+1} />
          </Button>
        )
      })}
    </div>

    {layout&&
      <div className={styles.gridContainer} style={{gridTemplateAreas: `"${(layout as number[][]).map(el => el.map(el=> 'o' + el).join(' ')).join('" "')}"`, gridTemplateColumns: `repeat(${(layout as number[][])[0].length}, 1fr)`}}>
        {[...new Set((layout as number[][]).flat(1)).values()].map((el, i) => {
          return <div className={classNames(styles.collageImageWrapper, images.has(el)&&styles.collageImageLoaded)} style={{gridArea: `o${el}`}}> 
          {(!images.has(el)) &&
            <FilesField 
            name={`assetsList[${i}]`}
            getImages={(ind) => setImages(state=> {
              ind.forEach(e=> state.set(el, e))
              return state
            })}
            />
            ||
            <Image src={FILES + images.get(el).source} alt={''} width={600} height={600} className={styles.collageImage}/>
          }
          </div>
        })}
      </div>
    }
  </div>

  const layoutHTML = <div className={styles.layoutHTML}>
    <P  styleType={['large', 'w500']}>{t('constructor_addHTML')}</P>
    <TextAreaField autoSize name='text' onChange={(e)=>formik.setFieldValue('text', e.target.value)}/>
    {formik.values.text &&<>
      <P styleType={['large', 'w500']}>{t('constructor_preview')}</P>
      <HtmlText text={formik.values.text}/>
    </>}
  </div>

  const layoutBanner = <div className={styles.layoutPlace}>
    <P styleType={['large', 'w500']}>{t('constructor_chooseTextLayout')}</P>
    <div className={styles.buttonsWrapper}>
      {textPositionsArray.map((el, i) => {
        return (
          <Button 
          type='button' 
          styleType={['black', 'icon']} 
          onClick={()=>setLayout([[el]])}>
            <DotSvg color={layout?.[0]?.[0]===el&&colors.blue}/>
          </Button>
        )
      })}
    </div>
    {images.size > 0 && layout &&
      <div className={styles.banner}>
        <Image src={FILES + [...images.values()][0].source} alt={''} width={600} height={600} className={styles.bannerImage}/>
        <div className={styles.bannerOverlay}  style={{gridArea: layout[0][0]}}>
          <HtmlText text={formik.values.text}/>
        </div>
      </div>
    }
  </div>

  const layoutColumns = <div className={styles.layoutColumns}>
    <P styleType={['large', 'w500']}>{t('constructor_chooseColunmsCount')}</P>
    <div className={styles.buttonsWrapper}>
      <Button type='button' styleType={['black']} onClick={()=>setLayout([[1, 2]])}>2</Button>
      <Button type='button' styleType={['black']} onClick={()=>setLayout([[1,2,3]])}>3</Button>
    </div>
    {layout&&
      <div className={styles.gridContainer} style={{gridTemplateAreas: `"${(layout as number[][]).map(el => el.map(el=> 'o' + el).join(' ')).join('" "')}"`, gridTemplateColumns: `repeat(${(layout as number[][])[0].length}, 1fr)`}}>
        {layout[0].map((el, i) => {
          return <div className={classNames(styles.columnWrapper) } style={{gridArea: `o${el}`}}>
            <InputField 
            styleType={'default'} 
            color={'white'} 
            name={`titles[${i}]`}
            label='Заголовок'
            labelType='top'
            />

            {(!images.has(i+1)) &&
              <FilesField 
              name={`assetsList[${i}]`}
              getImages={(ind) => setImages(state=> {
                ind.forEach(e=> state.set(Number(el), e))
                return state
              })}
              />
              ||
              <Image src={FILES + images.get(i+1).source} alt={''} width={600} height={600} className={styles.columnImage}/>
            }
            <RichTextField hideButtons={{helpers: true}} name={`texts[${i}]`}/>
          </div>
        })}
      </div>
    }
  </div>

  const layoutSocial = <div className={styles.layoutSocial}>
    <P styleType={['large', 'w500']}>{t('constructor_setSocialLinks')}</P>
    {Object.values(SocialSites).map((el, ind) => {
      return <InputField styleType={'default'} color={'default'} name={`texts[${ind}].${el}`} label={el} labelType='top'/>
    })}
  </div>

  const layoutVideoText = <div className={styles.videoText}>
    <P styleType={['large', 'w500']}>{t('constructor_chooseTextVideoLayout')}</P>
    <div className={styles.buttonsWrapper}>
      <Button type='button' styleType={['black']} onClick={()=>setLayout([['video', 'text']])}>{t('constructor_video')} | {t('constructor_text')}</Button>
      <Button type='button' styleType={['black']} onClick={()=>setLayout([['text','video' ]])}> {t('constructor_text')} | {t('constructor_video')}</Button>
    </div>
    {layout &&
      <div className={styles.videoTextWrapper} style={{gridTemplateAreas: `"${layout?.[0].join(' ')}"`}}>
        <div className={styles.item} style={{gridArea:'video'}}>
          {images.size === 0 &&
          <FilesField 
          name={'assets'} 
          accept={['.mp4', '.webm', '.ogg', '.mov']}
          buttonName={t('personal_addVideo')} 
          initialImages={args.initialData?.assets}
          getImages={(i)=> setImages(_=> {
            const newImages = new Map()
            i.forEach(el=> newImages.set(el.id, el))
            return newImages
          })}
          />
          ||
          images.has(1) &&
          <ReactPlayer width={'100%'} height={'auto'} url={FILES + images.get(1).source} controls/>
         }
        </div>
        <div className={styles.item} style={{gridArea:'text'}}>
          <RichTextField hideButtons={{helpers: true}} name={'text'}/>  
        </div>
      </div>
    }
  </div>

  const imageField = <FilesField 
  name={'assets'} 
  initialImages={args.initialData?.assets} 
  getImages={(i) => setImages(_=> {
    const newImages = new Map()
    i.forEach(el=> newImages.set(el.id, el))
    return newImages
  })}
  />

  const videoField = <FilesField 
  name={'assets'} 
  buttonName={t('personal_addVideo')} 
  initialImages={args.initialData?.assets}
  getImages={(i)=> setImages(_=> {
    const newImages = new Map()
    i.forEach(el=> newImages.set(el.id, el))
    return newImages
  })}
  />

  const getInputs = (): JSX.Element[] => {
    switch (args.type) {
      case PersonalBlockType.Text:
        return [titleInput, richText]
      case PersonalBlockType.Image:
        return [titleInput, imageField]
      case PersonalBlockType.Gallery:
        return [titleInput, imageField]
      case PersonalBlockType.Video:
        return [titleInput, videoField]
      case PersonalBlockType.Banner:
        return [richText, imageField, layoutBanner]
      case PersonalBlockType.Collage:
        return [titleInput, layoutGrid]
      case PersonalBlockType.Columns:
        return [layoutColumns]
      case PersonalBlockType.Social: 
        return [titleInput, layoutSocial]
      case PersonalBlockType.Html:
        return [layoutHTML]
      case PersonalBlockType.VideoText:
        return [layoutVideoText]
    }
  }

  const body = (
    <div className={styles.root}>
      <BackTextButton onClick={props.onClose}/>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          {getInputs()}
          <Button className={styles.submitButton} type='submit'>{t('save')}</Button>
        </Form>
      </FormikProvider>
    </div>
  )

  return (<ModalLayout className={styles.modalLayout} mobileFullScreen>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}