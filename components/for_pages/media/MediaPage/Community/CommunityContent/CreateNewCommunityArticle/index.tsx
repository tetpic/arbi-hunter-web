import styles from './index.module.scss'

import FileInput from 'components/fields/FileInput'
import InputField from 'components/fields/InputField'
import RichTextField from 'components/fields/RichTextField'
import Button from 'components/ui/Button'
import { useCommunityContext } from 'context/community_state'
import { useAppContext } from 'context/state'
import { ICreateNews, IArticleBlock, PreviewImage } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import { Form, FormikHelpers, FormikProvider, useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { CategoryType, Preset } from 'types/enums'
import TitleForSection from 'components/ui/TitleForSection'
import { useResize } from 'components/hooks/useResize'
import classNames from 'classnames'
import PlusSvg from 'components/svg/PlusSvg'
import Image from 'next/image'
import CrossSvg from 'components/svg/CrossSvg'
import ImageHelper from 'utils/ImageHelper'

interface Props {
  article?: IArticle
  title?: string
}

export default function CreateNewCommunityArticle(props: Props) {
  const communityContext = useCommunityContext()
  const appContext = useAppContext()
  const [previewImage, setPreviewImage] = useState<PreviewImage>()
  const [images, setImages] = useState<PreviewImage[]>([])
  const {isTabletWidth} = useResize()

  const submit = (data: IArticleBlock, helpers: FormikHelpers<IArticleBlock>) => {    
    const submitData:ICreateNews = {
      communityId: communityContext.currentCommunity.id,
      articleType: CategoryType.News,     
      name: data.title,
      published: true,
      image: {id: +previewImage?.id||props.article?.image?.id|| null},
      imageIds: images.map(i=> +i.id),
      blocks: [
        {
          title: '',
          body: data.body,
            // image: null,
            // imageLarge: null,
        }, 
        ...images.map(im=> {
          return {
            title: '', 
            body: '', 
            image: {id: +im.id}, 
            imageLarge: {id: +im.id}
          }
        })
      ],
    }
    
    communityContext.createNews(submitData, props?.article?.id)
    .then(_=> {
      helpers.resetForm()
      setPreviewImage(null)
      setImages([])
      appContext.hideModal()
    })
  }

  const formik = useFormik<IArticleBlock>({
    initialValues: {
      title: props?.article?.name||'',
      body: props?.article?.blocks[0].body||'',
    },
    onSubmit: submit
  })

  const removeImage = (id: number|string) => {
    setImages(state=> state.filter(i=> i.id !== id))
  }

  useEffect(()=>{
    setImages(props?.article?.blocks.slice(1).map(i=> ({id: i.image.id, source: i.image.source, loaded: true} as PreviewImage))||[])
  }, [])

  return (<div className={styles.root}> 
    <TitleForSection onBackClick={()=>{isTabletWidth&&appContext.hideModal()}} title={props.title||'Опубликуйте запись'}/>
    <FormikProvider value={formik}>
      <Form className={styles.form}>
        <div className={styles.addCover}>
          {(props.article?.image?.source || previewImage?.image) &&
          <Image 
          unoptimized 
          src={props.article?.image?.source
            ?ImageHelper.urlFromFile(props.article.image, Preset.mdResize)
            :URL.createObjectURL(previewImage?.image)
          } 
          alt={''} 
          width={700} 
          height={400}
          />
          }
          {(!props.article?.image?.source && !previewImage?.image) &&
          <p className={styles.subTitle}>Добавить обложку <br/> (не обязательно)</p>
          }
          <label className={styles.label}>
            <FileInput setImages={setPreviewImage}/>
            <div className={styles.addCoverButton}><PlusSvg/></div>
          </label>
        </div>

        <InputField 
        placeholder='Название' 
        name={'title'} 
        styleType={'default'} 
        color={'default'} 
        />

        <RichTextField 
        value={formik.values.body?.toString()}  
        returnValueType={'html'}  
        placeholder='Введите текст' 
        name={'body'} 
        onAddImage={setImages} 
        hideButtons={{helpers: true}}
        />

        {images &&images.length > 0 &&
          <div className={styles.imagesWrapper}>
            {images.map(i=> {
              return  <div className={styles.image}>
              <img key={i.id} src={i.source?ImageHelper.urlFromSource(i.source):URL.createObjectURL(i.image)} alt={''}/>
              <Button type='button' className={styles.removeButton} onClick={()=> removeImage(i.id)}><CrossSvg/></Button>
              </div>
            })}
          </div>
        }

        <div className={styles.buttonsWrapper}>
          <Button type="submit" className={classNames(styles.yellowButton, (formik.values.body?.toString().length < 8||!formik.values.title)&&styles.disabled)}>Опубликовать</Button>
        </div>

      </Form>
    </FormikProvider>
  </div>)
}