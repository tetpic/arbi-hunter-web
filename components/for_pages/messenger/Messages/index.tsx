import styles from './index.module.scss'

import UserPic from 'components/ui/UserPic'
import Formatter from 'utils/formatter'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import MessageFactory from './MessageFactory'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useChatDialogContext } from 'context/chat_dialog_state'
import { ActivityStatus, AppTheme, MessageType, ModalType, Preset } from 'types/enums'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import Button from 'components/ui/Button'
import {v4 as uuidv4} from 'uuid'
import CloseTransparentSvg from 'components/svg/CloseTransparentSvg'
import InfiniteScroll from 'react-infinite-scroll-component'
import RecordSvg from 'components/svg/RecordSvg'
import BackBtn from 'components/ui/BackBtn'
import { IUserProfile } from 'data/interfaces/IUser'
import classNames from 'classnames'
import { ICV } from 'data/interfaces/ICV'
import CvRepository from 'data/repositories/CvRepository'
import folderImage from 'images/folder.png'
import Image from 'next/image'
import Link from 'next/link'
import { clearObject, getUserImageSource, getUserName } from 'utils/helpers'
import { useRouter } from 'next/navigation'
import P from '@/components/ui/P'
import { useAppContext } from 'context/state'
import useTranslation from 'next-translate/useTranslation'
import { IMessage } from 'data/interfaces/IChat'
import CrossSvg from '@/components/svg/CrossSvg'
import { LiveAudioVisualizer } from '../../../../node_modules/react-audio-visualize'
import CheckSvg from '@/components/svg/CheckSvg'
import ShareMessageSvg from '@/components/svg/ShareMessageSvg'
import TrashBasketAltSvg from '@/components/svg/TrashBasketAltSvg'
import { ForwardMessageModalArgs } from '@/components/modals/ForwardMessageModal'
import { useChatContext } from 'context/chat_state'
import ChatRepository from 'data/repositories/ChatRepository'
import { IConfirmModalProps } from '@/components/modals/ConfirmModal'
import DocumentSheetSvg from '@/components/svg/DocumentSheetSvg'
import PinMessageSvg from '@/components/svg/PinMessageSvg'
import Spacer from '@/components/ui/Spacer'

interface Props {
  onBackClick: () => void
}

export default function Messages(props: Props) {
  const {t} = useTranslation()
  const dialog = useChatDialogContext()
  const chatContext = useChatContext()
  const {messages, loading, chat} = dialog
  const [pastedFiles, setPastedFiles] = useState<Map<string, File>>(new Map)
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const isLightTheme = appContext.theme === AppTheme.Light
  const [collocutor, setCollocutor] = useState<IUserProfile>()
  const [cv, setCv] = useState<ICV>(null)
  const router = useRouter()
  const [choosenIds, setChoosenIds] = useState<Set<number>>(new Set)
  const userContext = useUserContext()
  const [value, setValue] = useState<string>('')
  const [replyTo, setReplyTo] = useState<IMessage>(null)
  const inputRef = useRef<HTMLInputElement>(null!)

  const sendMessage = () => {
    if (!value.replace(/\s+/g, ' ').trim() && pastedFiles.size === 0) {
      return
    }
    if(pastedFiles.size === 0) {
      const clearedMessage = clearObject({message:value, type: MessageType.Text, replyToId: Number(replyTo?.id)})
      dialog.sendMessage(clearedMessage)
      .then(_=> {
        const container = document.querySelector('.infinite-scroll-component > div')
        container.scrollIntoView({behavior: 'smooth', block: 'end'})
      })
    }
    else {
      const images = [...pastedFiles.values()].filter(file=> file.type.includes('image'))
      const files = [...pastedFiles.values()].filter(file=> !file.type.includes('image'))

      if(images.length > 0) {
        dialog.sendMessage({message: value, type: MessageType.Asset}, {pastedImages: images})
        .then(_=> {
          const container = document.querySelector('.infinite-scroll-component > div')
          container.scrollIntoView({behavior: 'smooth', block: 'end'})
        })
      }
      if(files.length > 0) {
        dialog.sendMessage({message: value, type: MessageType.Asset}, {pastedImages: files})
        .then(_=> {
          const container = document.querySelector('.infinite-scroll-component > div')
          container.scrollIntoView({behavior: 'smooth', block: 'end'})
        })
      }

    }
    setValue('')
    setPastedFiles(state=> {
      state.clear()
      return new Map(state)
    })
  }

  const enterPressHandler = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      sendMessage()
      inputRef.current.blur()
    }
  }
  
  const onPasteHandler = (e: React.ClipboardEvent<HTMLDivElement>) => {
    //https://stackoverflow.com/questions/6333814/how-does-the-paste-image-from-clipboard-functionality-work-in-gmail-and-google-c
    const items = e.clipboardData.items
    for (let index in items) {
      let item = items[index]
      const fakeId = uuidv4()
      if (item.kind === 'file') {
        const blob = item.getAsFile()
        if(blob.type === 'image/png' || blob.type === 'image/jpeg' || blob.type === 'image/jpg') {
          setPastedFiles(state => new Map([...state.entries(), [fakeId, blob]]))
        }
      }
    }
  }

  const addFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const items = e.target.files
    for (let i = 0; i < items.length; i++) {
      const fakeId = uuidv4()
      setPastedFiles(state => new Map([...state.entries(), [fakeId, items[i]]]))
    }
  }

  const removeHandler = (key: string) => {
    setPastedFiles(state=> {
      state.delete(key)
      return new Map(state)
    })
  }

  const onTopClick = () => {
    router.push('/personal/' + collocutor?.id)
  }

  const onBackClick = (e:React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    props.onBackClick()
  }


  const forwardHandler = () => {
    const sendMultiMessages = async(chatId: number) => {
      const res = await Promise.all([...choosenIds].map(id=> {
        ChatRepository.createMessage({message: '', type: MessageType.Text, chatId: chatId, forwardedId: id})
      }))
      setChoosenIds(new Set)
    }

    appContext.showModal<ForwardMessageModalArgs>(ModalType.ForwardMessageModal, {
      chats: [...chatContext.chats.values()],
      forwardedMessagesList: [...choosenIds.values()],
      forwardedId: Number(dialog.chat.id),
      onSend: (chatId: number) => {
        
        appContext.hideModal()
        sendMultiMessages(chatId)
      }
    })
  }

  const deleteHandler = () => {
    const _removeMessages = async() =>  {
      const res = await Promise.all([...choosenIds].map(id=> {
        dialog.removeMessage('forMe', id)
      }))
      setChoosenIds(new Set)
    }
    appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, {
      text: `Вы действительно хотите удалить ${choosenIds.size} cообщений?`,
      callback: () => {
        _removeMessages()
        appContext.hideModal()
      }
    })

  }

  const removeChat = () => {
    const _args:IConfirmModalProps  = {
      text: `Вы действительно хотите удалить чат с ${getUserName(collocutor)}`,
      callback: () => {
        ChatRepository.removeOneChat(Number(dialog.chat.id))
        .then(res => {
          chatContext.removeChat(Number(dialog.chat.id))
          isTabletWidth?appContext.hideBottomSheet():appContext.hideModal()
        })
      }
    }
    isTabletWidth
    ?appContext.showBottomSheet<IConfirmModalProps>(ModalType.ConfirmModal, _args, 180)
    :appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, _args)
  }

  const isHirer = userContext?.currentProfile?.profileType === ProfileType.Hirer


  //TODO:  убрать получение cv после оптимизации запросов к чатам и сообщениям
    useEffect(()=>{
      if(dialog.chat) {
        setCollocutor(dialog.chat?.profiles[0]?.role === 'admin'?dialog.chat?.participant:dialog?.chat?.profile)
        if(dialog?.chat?.application?.cv?.id||dialog?.chat?.proposal?.cv?.id) {
          CvRepository.getById(dialog?.chat?.application?.cv?.id||dialog?.chat?.proposal?.cv?.id)
          .then(cv=> {
            setCv(cv)
          })
          .catch(err=> {
            setCv(null)
          })
        }
        else {
          setCv(null)
        }
      }
    }, [dialog.chat])


  return (
    <div className={styles.root}> 
      {choosenIds.size === 0 &&
      <div className={styles.top} onClick={onTopClick}>
        {dialog.chat &&
        <>
          {isTabletWidth &&
            <BackBtn className={styles.backButton} altStyleType={['icon', 'white', 'invertSvg']} onClick={(e) => onBackClick(e)} bgColor={'transparent'}/>
          }
          <UserPic 
          size={48} 
          className={styles.userPic} 
          onClick={()=> router.push('/personal/' + collocutor?.id)}
          image={getUserImageSource(collocutor, Preset.smallIconCrop)}
          />
          <P styleType={['large', 'w500']} useThemeColor className={styles.name}>{collocutor?.profileType === ProfileType.Employee?getUserName(collocutor):collocutor?.company}</P>
          {collocutor?.activityStatus===ActivityStatus.Online&&
          <p className={styles.time}>{<span className={styles.online}>{t('chat_online')}</span>}</p>
          }
         
        </>
        ||
        <Spinner size={48} color={colors.blue}/>
        }
      </div>
      }
      {choosenIds.size > 0 && 
        <div className={styles.topChooseMode}>
          <Button onClick={removeChat}>
            <P styleType={['blue', 'w500', 'medium']}>
              Удалить чат
            </P>
          </Button>
          <P styleType={['large', 'w600']} useThemeColor >Выбрано {choosenIds.size}</P>
          <Button onClick={()=>setChoosenIds(new Set)}> 
            <P styleType={['blue', 'w500', 'medium']}>
              Отменить
            </P>
          </Button>
        </div>
      }
      {(dialog.chat?.proposal?.vacancy?.id.toString()||dialog.chat?.application?.vacancy?.id.toString())&&
        <Link  
        href={'/vacancy/' + (dialog.chat?.proposal?.vacancy?.id.toString()||dialog.chat?.application?.vacancy?.id.toString())} 
        className={styles.invite}
        >
          <p className={styles.invite__title}>{t('chat_chatByVacancy')}</p>
          <P styleType={['small', 'w500']} useThemeColor className={styles.invite__vacancy}>{dialog.chat?.proposal?.vacancy?.name||dialog.chat?.application?.vacancy?.name}</P>
        </Link>
      }
      {dialog.pinned.size>0 &&
        <div className={styles.pinnedMessages}>
          <div className={styles.pinnedImage}>
            <PinMessageSvg/>
          </div>
          <div className={styles.pinnedMessagesWrapper}>

          {dialog.pinned &&[...dialog.pinned?.values()].map(el => {
            return <div className={styles.pinnedMessage}>
              <P styleType={['greyLight', 'w500','small']}>{
                el.type === MessageType.Text&&el.message
                ||
                el.type === MessageType.Application&&'Приглашение'
                ||
                el.type === MessageType.Asset&&'Файлы'
                ||
                el.type === MessageType.Voice &&'Голосовое сообщение'
              }</P>
            </div>
          })}
          </div>
        </div>
      }
      <div 
      className={classNames(styles.messagesWrapper, cv && cv.categories[0] && styles.messagesWrapper_withCv, (dialog.chat?.application?.vacancy?.id||dialog.chat?.proposal?.vacancy?.id) && styles.messagesWrapper_withVacancy)} 
      id={'chat-messages'}
      ref={dialog.scrollableTarget as RefObject<HTMLDivElement>}
      >
      <InfiniteScroll
      dataLength={dialog.messages.size}
      next={dialog.fetchMore}
      scrollableTarget={'chat-messages'}
      inverse
      height={'100%'}
      style={{display: 'flex', flexDirection: 'column-reverse'}}
      loader={<Spinner size={24} color={colors.blue}/>}
      hasMore={dialog.totalMessages > dialog.messages.size}
      scrollThreshold={0.6}>
        {
          messages.size>0&&[...messages.values()].map(el=> {
            return <div 
            className={classNames(
              styles.messageLine, 
              choosenIds.size > 0 && styles.chooseMode, 
              choosenIds.has(Number(el.id)) && styles.choosenLine
            )} 
            onClick={() => {
              choosenIds.size > 0 && 
              setChoosenIds(state => {
                if(state.has(Number(el.id))) {
                  state.delete(Number(el.id))
                  return new Set(state)
                }
                else {
                  return new Set(choosenIds.add(Number(el.id)))
                }
              })
            }} 
            >
              {choosenIds.size > 0 && 
                <div className={styles.choosenCheck}>
                  {choosenIds.has(Number(el.id)) &&
                    <CheckSvg/>
                  }
                </div>
              }
              <MessageFactory 
              multiCheckMode={choosenIds.size>0} 
              onReply={(m)=>setReplyTo(m)}
              onSet={(m) => setChoosenIds(new Set(choosenIds.add(Number(m.id))))} 
              key={el.id.toString()+el.chatId?.toString()} 
              profileId={userContext?.currentProfile?.id} 
              message={el} 
              application={chat?.application} 
              />
            </div>
          })
          ||
          loading && messages.size===0 && <Spinner size={24} color={colors.blue}/>
          ||
          <p className={classNames(styles.empty, 'empty')}>{t('chat_noMessages')}</p>
        }
      </InfiniteScroll>
      </div>
      {cv && cv.categories[0] &&
      <Link href={`/cv/${cv.id}`} className={styles.bottom}>
        <p className={styles.bottom__desc}>{cv?.categories[0]?.name}</p>
      </Link>
      }
      <div className={classNames(styles.newMessage, userContext.currentProfile?.profileType === ProfileType.Employee
            && dialog.chat?.employeeCanWrite === false && styles.newMessage_disabled)} onPaste={onPasteHandler}>
        {replyTo &&
          <div className={styles.replyMessage}>
            <div className={styles.replyMessageContent}>
              <P styleType={['greyLight', 'small']}>Reply from {getUserName(replyTo.profile)}</P>
              <P styleType={['medium']}>{replyTo.message}</P>
            </div>
            <Button styleType={['icon', 'backTransparent', 'circle']} onClick={() => setReplyTo(null)}><CrossSvg/></Button>
          </div>
        }
        {(pastedFiles.size>0) && 
        <div className={styles.imagesWrapper}>
          {[...pastedFiles.entries()].filter(([key, el])=> el.type.includes('image')).map(([key, el]) => {
            return <div className={styles.image}>
              {el.type.includes('image') &&
                <img src={URL.createObjectURL(el)}/>
                ||
                <>
                <Image alt='image' src={folderImage} width={100} height={100} style={{objectFit: 'contain'}} />
                <p className={styles.fileName}>{el.name}</p>

                </>
              } 
              <Button onClick={()=>removeHandler(key)} className={styles.removeImage}>
                <CloseTransparentSvg/>
              </Button> 
            </div>
          })}
          {[...pastedFiles.entries()].filter(([key, el])=> !el.type.includes('image')).map(([key, el]) => {
            return <div className={styles.file}>
              <div className={styles.fileContent}>
                <div className={styles.fileImageWrapper}>
                  <DocumentSheetSvg/>
                </div>
                <P styleType={['small', 'w500']} useThemeColor >{el.name}</P>
              <Button onClick={()=>removeHandler(key)} className={styles.removeImage}>
                <CloseTransparentSvg/>
              </Button> 
              </div>
            </div>
          })}
        </div>
        }
        {choosenIds.size > 0 &&
          <div className={styles.choosenActions}>
            {!isTabletWidth &&
              <P styleType={['greyLight', 'w600', 'medium']} useThemeColor>Выбрано сообщений: {choosenIds.size}</P>
            }
            <Button styleType={['icon','backTransparent', 'svg24', 'circle']} onClick={deleteHandler}><TrashBasketAltSvg color={colors.blue}/></Button>
            <Button styleType={['icon','backTransparent', 'svg24', 'circle']} onClick={forwardHandler}><ShareMessageSvg color={colors.blue}/></Button>
          </div>
        }
        {dialog.recorder?.current?.state !== 'recording' && choosenIds.size === 0 && 
        <>
        <label>
          <img src={'/icons/paperclip.svg'}  alt='paperclip' className={styles.paperClip}/>
          <input type='file' accept='image/png, image/jpg, image/jpeg, image/webp, image/svg+xml, .pdf, .doc, .docx' multiple onChange={(e)=>addFileHandler(e)} style={{display: 'none'}}/>
        </label>
        <input value={value} ref={inputRef} enterKeyHint='send' onChange={(e)=>{
          if(userContext.currentProfile?.profileType === ProfileType.Employee
            && dialog.chat?.employeeCanWrite === false
          ) {
            return
          }
          else {
            setValue(e.currentTarget.value)
          }
          }} onKeyDown={(e)=>e.key==='Enter'&&enterPressHandler(e)} className={styles.input} type="text" placeholder={t('chat_enterMessage')} />
        </>
        }
        { choosenIds.size === 0 &&     
        <div className={classNames(styles.microphoneWrapper, dialog.recorder?.current?.state === 'recording'&&styles.recording)} onClick={()=>dialog.recordVoice()}>
          {
          dialog.recorder?.current?.state === 'recording' &&
            <>
              <LiveAudioVisualizer mediaRecorder={dialog.recorder?.current} width={720} height={40}  fftSize={1024}/>
              <span className={styles.recordTime}>{Formatter.formatSecondsToTime(dialog.recordTime)}</span>
              <RecordSvg/>
              <Spacer basis={16}/>
              <P styleType={['small', 'w500', 'greyLight']}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                dialog.recordVoice(true)
              }}
              >
                Отмена
              </P>
            </>
            ||
            (value.length > 0 || pastedFiles.size > 0) &&
            <img onClick={(e)=>{e.stopPropagation();sendMessage()}} src={'/icons/send.svg'} alt='send icon'/>
            ||
            <img src={'/icons/microphone.svg'} alt='microphone icon'/>
          }
        </div>
        }
      </div>
    </div>
  )
}

