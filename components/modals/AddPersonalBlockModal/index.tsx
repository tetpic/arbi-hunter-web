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
import { useState } from 'react'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export interface IAddPersonalBlockModalProps {
  type: PersonalBlockType
  onSubmit: (data: Partial<IPersonalPageBlock>, images?: IFile[]) => void
  initialData?: {block: Partial<IPersonalPageBlock>, assets: IFile[]}
}
/**
 * чтобы понять что происходит в этой модалке, я объясню...
 * с бэка приходит personalPage, в ней есть массив с блоками, в каждом блоке есть массив с айдишниками изображений, но нет самих объектов изображений
 * потому что они лежат в отдельном массиве. поэтому чтобы все ок работало, приходится писать такую дичь...
 */
export default function AddPersonalBlockModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as IAddPersonalBlockModalProps
  const [images, setImages] = useState<Map<number, IFile>>(new Map(args.initialData&&args.initialData.assets.map(el=> [el.id, el])))

  const submit = (data: Partial<IPersonalPageBlock>) => {
    const submitData = {
      ...data,
    }
    args.onSubmit(submitData, [...images.values()])
    appContext.hideModal()
  }

  const formik = useFormik<Partial<IPersonalPageBlock>>({
    initialValues: {
      type: args.type,
      text: args.initialData?.block?.text||'',
      title: args.initialData?.block?.title||'',
      assets: [],
    },
    onSubmit: submit
  })

  const titleInput = <InputField placeholder={'Заголовок'} styleType={'default'} color={'default'} name={'title'}/>
  const richText = <RichTextField hideButtons={{helpers: true}} name='text'/>
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
  buttonName='Добавить видео' 
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
    }
  }

  const body = (
    <div className={styles.root}>
      <BackTextButton onClick={props.onClose}/>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          {getInputs()}
          <Button className={styles.submitButton} type='submit'>Сохранить</Button>
        </Form>
      </FormikProvider>
    </div>
  )

  return (<ModalLayout className={styles.modalLayout} >
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}