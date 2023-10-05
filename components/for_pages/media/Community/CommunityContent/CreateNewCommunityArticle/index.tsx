import FileInput from 'components/fields/FileInput'
import InputField from 'components/fields/InputField'
import RichTextField from 'components/fields/RichTextField'
import PhotoSvg from 'components/svg/PhotoSvg'
import Button from 'components/ui/Button'
import { useCommunityContext } from 'context/community_state'
import { useAppContext } from 'context/state'
import { ICreateNews, IArticleBlock, PreviewImage } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import { Form, FormikHelpers, FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import { CategoryType } from 'types/enums'
import TitleForSection from 'components/ui/TitleForSection'
import { useResize } from 'components/hooks/useResize'
import styles from './index.module.scss'

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
      image: {id: +previewImage?.id||null},
      imageIds: images.map(i=> +i.id),
      blocks: [
        {
          title: '',
          body: data.body,
          image: null,
          imageLarge: null,
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
  

  return (<div className={styles.root}> 
    <TitleForSection onBackClick={()=>{isTabletWidth&&appContext.hideModal()}} title={props.title||'Опубликуйте запись'}/>
    
    {/* <p className={styles.title}>{props.title||'Опубликуйте запись'}</p> */}
    <FormikProvider value={formik}>
      <Form className={styles.form}>
        <InputField placeholder='Название' name={'title'} styleType={'default'} color={'default'} />
        {previewImage && 
          <img src={URL.createObjectURL(previewImage.image)}/>
        }
        <RichTextField value={formik.values.body.toString()}  returnValueType={'html'}  placeholder='Введите текст' name={'body'} onAddImage={setImages} hideButtons={{helpers: true}}/>
        {images &&images.length > 0 &&
        <div className={styles.imagesWrapper}>
          {images.map(i=> {
            return  <img src={URL.createObjectURL(i.image)} alt={''}/>
          })}
        </div>
        }
        <div className={styles.buttonsWrapper}>
          <label className={styles.label}>
            <FileInput setImages={setPreviewImage}/>
            <PhotoSvg/>
          </label>
          <Button type="submit" className={styles.yellowButton}>Опубликовать</Button>

        </div>
      </Form>
    </FormikProvider>
  </div>)
}