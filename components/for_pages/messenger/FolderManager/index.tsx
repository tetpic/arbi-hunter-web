import styles from './index.module.scss'
import BackTextButton from 'components/ui/BackTextButton'
import { useChatContext } from 'context/chat_state'
import folderImage from 'images/folder.png'
import Image from 'next/image'
import Button from 'components/ui/Button'
import PlusSvg from 'components/svg/PlusSvg'
import { useEffect, useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import InputField from 'components/fields/InputField'
import IChat, { IChatFolder } from 'data/interfaces/IChat'
import { colors } from 'styles/variables'
import UserPic from 'components/ui/UserPic'
import { useAppContext } from 'context/state'
import { useResize } from 'components/hooks/useResize'
import { ModalType } from 'types/enums'
import Spacer from 'components/ui/Spacer'
import Validator from 'utils/Validator'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import { useUserContext } from 'context/user_state'
import ChatRepository from 'data/repositories/ChatRepository'

interface Props {
  onBack?: () => void
  folderToEdit?: IChatFolder
}

function FolderEditor(props: Props) {
  const chatContext = useChatContext()
  const appContext= useAppContext()
  const userContext = useUserContext()
  const {isPhoneWidth} = useResize()
  const [choosenChats, setChoosenChats] = useState<Map<number, IChat>>(new Map)

  const saveHandler = (c: IChat[]) => {
    setChoosenChats(state=> {
      c.forEach(el=> {
        state.set(el.id, el)
      })
      return new Map(state)
    })
  }

  const addModalHandler = () => {
    isPhoneWidth
    ?appContext.showBottomSheet(ModalType.ChatsFolderModal, {chats:chatContext.chats, onSave: saveHandler})
    :appContext.showModal(ModalType.ChatsFolderModal, {chats: chatContext.chats, onSave: saveHandler})
  }

  const removeChatFromlist = (c: IChat) => {
    setChoosenChats(state=> {
      state.delete(c.id)
      return new Map(state)
    })
  }

  useEffect(()=>{
    if(!props.folderToEdit) {return}
    ChatRepository.getChatList({chatFolderId: props.folderToEdit.id}, userContext.currentProfile.profileType)
    .then(res=> {
      setChoosenChats(new Map(res.data.map(r=>[r.id, r])))
    })
  }, [])

  const submit = (data: any) => {
    if(!props.folderToEdit) {
      chatContext.createChatFolder(data.name, [...choosenChats.values()])
      .then(_=> {
        props.onBack()
      })
    }
    else {
      chatContext.editChatFolder({
        chatFolderId: props.folderToEdit.id, 
        chatsIds: [...choosenChats.values()].map(e=> e.id)
      }, data.name)
      .then(_=> {
        props.onBack()
      })
    }
  }

  const formik = useFormik<any>({
    initialValues: {
      name: props.folderToEdit?.name||'',
    },
    onSubmit: submit
  })



  return (
    <FormikProvider value={formik}>
      <Form className={styles.folderWrapper}>

        <p className={styles.folderTitle}>НАЗВАНИЕ ПАПКИ</p>
        <InputField validate={Validator.required}  name={'name'} styleType={'profile'} color={'white'}/>
        <Spacer basis={24}/>

        <p className={styles.folderTitle}>ВЫБРАТЬ ЧАТЫ</p>
        <div className={styles.chatsWrapper}>
          <div className={styles.item} onClick={addModalHandler}><PlusSvg color={colors.yellow} /><span>Добавить чаты</span></div>
          {[...choosenChats.values()].map(chat=> {
            const collocutor = chat.profiles[0].role === 'admin'?chat.participant:chat.profile
            return (
              <div className={styles.item}>
                <UserPic size={32}/>
                <p className={styles.name}>{collocutor.firstName} {collocutor.lastName}</p>
                <Button type='button' className={styles.removeButton} onClick={()=>removeChatFromlist(chat)}><TrashBasketSvg/></Button>
              </div>
            )
          })}
        </div>
        <Button className={styles.createBtn} type='button' onClick={formik.submitForm}>
          {props.folderToEdit?'Сохранить': 'Создать папку'}
        </Button>
      </Form>
    </FormikProvider>
  )
}

export default function FolderManager() {
  const chatContext = useChatContext()
  const [creationMode, setCreationMode] = useState<boolean>(false)
  const [folderToEdit, setFolderToEdit] = useState<IChatFolder>()

  useEffect(()=>{
    if(folderToEdit) {
      setCreationMode(true)
    }
  }, [folderToEdit])
  

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
          {[...chatContext.folders.values()].map(folder => {
            return (
              <div className={styles.folder} onClick={()=> setFolderToEdit(folder)}>
                <p>{folder.name}</p>
                <Button type='button' stopPropagation onClick={(e)=>{e.stopPropagation(); chatContext.removeChatFolder(folder.id)}}><TrashBasketSvg/></Button>
              </div>
            )
          })}
        </div>
        ||
        creationMode && <FolderEditor folderToEdit={folderToEdit} onBack={()=>setCreationMode(false)}/>
      }
      {!creationMode &&
        <Button className={styles.createBtn} onClick={()=>setCreationMode(true)}> 
          <p><PlusSvg/><span>Создать новую папку</span></p>
        </Button>
      }
    </div>

  </div>)
}