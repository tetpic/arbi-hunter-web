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
import {  useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import Image from 'next/image'
import { FILES } from 'types/constants'
import classNames from 'classnames'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export interface IAddPersonalBlockModalProps {
  type: PersonalBlockType
  onSubmit: (data: Partial<IPersonalPageBlock>, images?: IFile[], layout?: any) => void
  initialData?: {block: Partial<IPersonalPageBlock>, assets: IFile[]}
}
/**
 * чтобы понять что происходит в этой модалке, я объясню...
 * с бэка приходит personalPage, в ней есть массив с блоками, в каждом блоке есть массив с айдишниками изображений, но нет самих объектов изображений
 * потому что они лежат в отдельном массиве. поэтому чтобы все ок работало, приходится писать такую дичь...
 */
export default function AddPersonalBlockModal(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const args = appContext.modalArguments as IAddPersonalBlockModalProps
  const [images, setImages] = useState<Map<number, IFile>>(new Map(args.initialData&&args.initialData.assets.map(el=> [el.id, el]))||new Map)
  const [layout, setLayout] = useState<any>()
 
  const submit = (data: Partial<IPersonalPageBlock>) => {
    const submitData = {
      ...data,
      layout: (layout as number[][]).map(el => el.map(e => images.get(e).id))
    }

    data.assetsList.length > 0 && (submitData.assets = data.assetsList.flat(1))
    delete submitData.assetsList 
    // const imagesLayout = (layout as number[][]).map(el => el.map(e => images.get(e).id))
    args.onSubmit(submitData, [...images.values()])
    appContext.hideModal()
  }

  const formik = useFormik<Partial<IPersonalPageBlock>>({
    initialValues: {
      type: args.type,
      text: args.initialData?.block?.text||'',
      title: args.initialData?.block?.title||'',
      assets: [],
      assetsList: [],
    },
    onSubmit: submit
  })

  const titleInput = <InputField placeholder={t('personal_header')} styleType={'default'} color={'default'} name={'title'}/>
  const richText = <RichTextField hideButtons={{helpers: true}} name='text'/>
  const layoutGrid = <div className={styles.layoutGrid}>
    <P>Выберите расположение картинок</P>
    <div className={styles.buttonsWrapper}>
      <Button type='button' styleType={['black']} onClick={()=>setLayout([[1, 2, 3], [4, 5, 6]])}>1|2|3 <br /> 4|5|6</Button>
      <Button type='button' styleType={['black']} onClick={()=>setLayout([[1, 1],[1, 1], [2, 3]])}>1|1 <br /> 1|1 <br /> 2|3</Button>
      <Button type='button' styleType={['black']} onClick={()=>setLayout([[1, 2, 3], [4,2,5], [6,2,7]])}>1|2|3 <br /> 4|2|5 <br /> 6|2|7</Button>
      <Button type='button' styleType={['black']} onClick={()=>setLayout([[1, 2, 3], [1,4,5]])}>1|2|3 <br /> 1|4|5</Button>
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
  const layoutPlace = <div className={styles.layoutPlace}>

  </div>
  const layoutColumns = <div className={styles.layoutColumns}>

  </div>
  const layoutSocial = <div className={styles.layoutSocial}>

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
        return [richText, imageField, layoutPlace]
      case PersonalBlockType.Collage:
        return [titleInput, imageField, layoutGrid]
      case PersonalBlockType.Columns:
        return [titleInput, imageField, richText, layoutColumns]
      case PersonalBlockType.Social: 
        return [titleInput, layoutSocial]
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