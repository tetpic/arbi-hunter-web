import FileInput from 'components/fields/FileInput'
import InputField from 'components/fields/InputField'
import RichTextField from 'components/fields/RichTextField'
import PhotoSvg from 'components/svg/PhotoSvg'
import Button from 'components/ui/Button'
import { useCommunityContext } from 'context/community_state'
import { ICreateNews, IArticleBlock, PreviewImage } from 'data/interfaces/Common'
import { Form, FormikHelpers, FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import { CategoryType } from 'types/enums'
import styles from './index.module.scss'

interface Props {
}

export default function CreateNewCommunityArticle(props: Props) {
  const communityContext = useCommunityContext()
  const [previewImage, setPreviewImage] = useState<PreviewImage>()
  const [images, setImages] = useState<PreviewImage[]>([])
  // const [blocks, setBlocks] = useState<any>()


  const submit = (data: IArticleBlock, helpers: FormikHelpers<IArticleBlock>) => {
    debugger
    const submitData:ICreateNews = {
      communityId: communityContext.currentCommunity.id,
      articleType: CategoryType.News,
      name: data.title,
      published: true,
      image: {id: +previewImage?.id||null},
      imageIds: images.map(i=> +i.id),
      // images: images.map(i=> +i.id),
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
    communityContext.createNews(submitData)
    .then(_=> {
      helpers.resetForm()
      setPreviewImage(null)
      setImages([])
    })
  }

  const formik = useFormik<IArticleBlock>({
    initialValues: {
      title: '',
      body: '',
    },
    onSubmit: submit
  })



  

  return (<div className={styles.root}> 
    <p className={styles.title}>Опубликуйте запись</p>
    <FormikProvider value={formik}>
      <Form className={styles.form}>
        <InputField placeholder='Название' name={'title'} styleType={'default'} color={'default'} />
        {previewImage && 
          <img src={URL.createObjectURL(previewImage.image)}/>
        }
        <RichTextField returnValueType={'html'}  placeholder='Введите текст' name={'body'} onAddImage={setImages} hideButtons={{helpers: true}}/>
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