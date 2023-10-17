import BackTextButton from 'components/ui/BackTextButton'
import { useChatContext } from 'context/chat_state'
import folderImage from 'images/folder.png'
import Image from 'next/image'
import Button from 'components/ui/Button'
import PlusSvg from 'components/svg/PlusSvg'
import styles from './index.module.scss'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import { useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import InputField from 'components/fields/InputField'
import CheckboxListField from 'components/fields/CheckboxListField'

interface Props {
}

function CreateNewFolder() {
  const chatContext = useChatContext()

  const submit = (data: any) => {

  }

  const formik = useFormik<any>({
    initialValues: {
      name: '',
      chats: []
    },
    onSubmit: submit
  })

  return (
    <FormikProvider value={formik}>
      <Form className={styles.folderWrapper}>

        <p className={styles.folderTitle}>НАЗВАНИЕ ПАПКИ</p>
        <InputField name={'name'} styleType={'profile'} color={'white'}/>

        <p className={styles.folderTitle}>ВЫБРАТЬ ЧАТЫ</p>
        <CheckboxListField name={'chats'} options={chatContext.chats.map(el=> {
          const collocutor = el.profiles[0].role === 'admin'?el.participant:el.profile
          return {value: el.id, label: `${collocutor.firstName} ${collocutor.lastName}`}
        })}/>

      </Form>
    </FormikProvider>
  )
}

export default function FolderManager(props: Props) {
  const chatContext = useChatContext()
  const [creationMode, setCreationMode] = useState<boolean>(false)

  return (<div className={styles.root}> 
    <div className={styles.top}>
      <BackTextButton className={styles.backButton} onClick={creationMode?()=>setCreationMode(false):chatContext.setFoldersActive}/>
    </div>
    <div className={styles.body}>
      <Image src={folderImage} alt={'folder image'} width={186} height={150}/>
      <p className={styles.tip}>Вы можете создать папки с нужными чатами и переключаться между ними.</p>
      {chatContext.folders&& chatContext.folders.size>0 && !creationMode &&
        <div className={styles.folderWrapper}>
          <p className={styles.folderTitle}>ВСЕ ПАПКИ</p>
          <div className={styles.folder}>
            <p>folderName</p>
            <ArrowRightSvg/>
          </div>
        </div>
        ||
        creationMode && <CreateNewFolder/>
      }
      <Button className={styles.createBtn} onClick={()=>setCreationMode(true)}> 
        <p><PlusSvg/><span>Создать новую папку</span></p>
      </Button>

    </div>

  </div>)
}