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
import BackBtn from 'components/ui/BackBtn'
import Title from 'components/ui/TitleForSection'
import classNames from 'classnames'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import { IChatsFolderModalProps } from 'components/modals/ChatsFolderModal'

interface Props {
  onBack?: () => void
  folderToEdit?: IChatFolder
  changeMode?: ()=>void
}

function FolderEditor(props: Props) {
  const chatContext = useChatContext()
  const appContext= useAppContext()
  const userContext = useUserContext()
  const {isTabletWidth} = useResize()
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
    isTabletWidth
    ?appContext.showBottomSheet<IChatsFolderModalProps>(ModalType.ChatsFolderModal, {chats: [...chatContext.chats.values()], onSave: saveHandler})
    :appContext.showModal<IChatsFolderModalProps>(ModalType.ChatsFolderModal, {chats: [...chatContext.chats.values()], onSave: saveHandler})
  }

  const removeChatFromlist = (c: IChat) => {
    setChoosenChats(state=> {
      state.delete(c.id)
      return new Map(state)
    })
  }

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

  useEffect(()=>{
    if(!props.folderToEdit) {return}
    ChatRepository.getChatList({chatFolderId: props.folderToEdit.id})
    .then(res=> {
      setChoosenChats(new Map(res.data.map(r=>[r.id, r])))
    })
  }, [])


  return (<>
      <div className={styles.top}>
        {isTabletWidth &&
          <>
            <BackBtn onClick={props.onBack} bgColor={'transparent'}/>
            <Title title={'Настройки чата'}/>
            <p className={styles.change} onClick={formik.submitForm}>{'Готово'}</p>
          </>
        ||
        <BackTextButton onClick={props.onBack}/>
        }
      </div>
      {!isTabletWidth && <>
        <div className={styles.imageWrapper}>
          <Image src={folderImage} alt={'folder image'} width={186} height={150} style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
        </div>
        <p className={styles.tip}>Вы можете создать папки с нужными чатами и переключаться между ними.</p>
      </>}
    <FormikProvider value={formik}>
      <Form className={styles.folderWrapper}>

        <p className={styles.folderTitle}>НАЗВАНИЕ ПАПКИ</p>
        <InputField validate={Validator.required}  name={'name'} styleType={'profile'} color={'white'}/>
        <Spacer basis={24}/>

        <p className={styles.folderTitle}>ВЫБРАТЬ ЧАТЫ</p>
        <div className={styles.chatsWrapper}>
          <div className={classNames(styles.item, choosenChats.size === 1&&styles.item_add)} onClick={addModalHandler}><PlusSvg color={colors.yellow} /><span>Добавить чаты</span></div>
          {[...choosenChats.values()].map(chat=> {
            const collocutor = chat.profiles[0].role === 'admin'?chat.participant:chat.profile
            return (
              <div className={styles.itemWrapper}>
                <div className={styles.item}>
                  <UserPic size={32}/>
                  <p className={styles.name}>{collocutor.firstName} {collocutor.lastName}</p>
                  <Button type='button' className={styles.removeButton} onClick={()=>removeChatFromlist(chat)}>{isTabletWidth?'Удалить':<TrashBasketSvg/>}</Button>
                </div>
              </div>
            )
          })}
        </div>
        {!isTabletWidth &&
          <Button className={styles.createBtn} type='button' onClick={formik.submitForm}>
            {props.folderToEdit?'Сохранить': 'Создать папку'}
          </Button>
        }
      </Form>
    </FormikProvider>
  </>)
}

export default function FolderManager() {
  const chatContext = useChatContext()
  const {isTabletWidth} = useResize()
  const [creationMode, setCreationMode] = useState<boolean>(false)
  const [deleteFolderMode, setDeleteFolderMode] =useState(true)
  const [folderToEdit, setFolderToEdit] = useState<IChatFolder>()


  useEffect(()=>{
    if(isTabletWidth) {
      setDeleteFolderMode(false)
    }
  }, [isTabletWidth])

  return (<div className={styles.root}> 
      {!creationMode &&
        <div className={styles.top}>
          {isTabletWidth &&
          <>
            <BackBtn onClick={creationMode?()=>setCreationMode(false):chatContext.setFoldersActive} bgColor={'transparent'}/>
            <Title title={'Папки с чатами'}/>
            <p className={styles.change} onClick={()=>setDeleteFolderMode(!deleteFolderMode)}>{deleteFolderMode?'Готово': 'Изм.'}</p>
          </>
            ||
            <BackTextButton className={styles.backButton} onClick={creationMode?()=>setCreationMode(false):chatContext.setFoldersActive}/>
          }
        </div>
      }
        {!creationMode && <>
          <div className={styles.imageWrapper}>
            <Image src={folderImage} alt={'folder image'} width={186} height={150} style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
          </div>
          <p className={styles.tip}>Вы можете создать папки с нужными чатами и переключаться между ними.</p>
        </>}
        {chatContext.folders&& chatContext.folders.size>0 && !creationMode &&
          <div className={styles.folderWrapper}>
            <p className={styles.folderTitle}>ВСЕ ПАПКИ</p>
            {[...chatContext.folders.values()].map(folder => {
              return (
                <div 
                className={styles.folder} 
                onClick={()=> {
                  setCreationMode(true)
                  setFolderToEdit(folder)
                }}
                >
                  <p>{folder.name}</p>
                  <Button 
                  type='button' 
                  stopPropagation 
                  className={classNames(styles.folderButton, !deleteFolderMode&&styles.folderButton_disabled)}
                  onClick={(e)=>{
                    if(deleteFolderMode) {
                      e.stopPropagation()
                      chatContext.removeChatFolder(folder.id)
                    }
                  }}>
                    {deleteFolderMode?<TrashBasketSvg/>:<ArrowRightSvg/>}
                  </Button>
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
  </div>)
}