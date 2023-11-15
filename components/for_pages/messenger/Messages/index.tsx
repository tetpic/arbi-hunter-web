import styles from './index.module.scss'

import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import InformationSvg from 'components/svg/InformationSvg'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import MessageFactory from './MessageFactory'
import { RefObject, useEffect, useState } from 'react'
import { useChatDialogContext } from 'context/chat_dialog_state'
import { MessageType } from 'types/enums'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import Button from 'components/ui/Button'
import {v4 as uuidv4} from 'uuid'
import CloseTransparentSvg from 'components/svg/CloseTransparentSvg'
import InfiniteScroll from 'react-infinite-scroll-component'
import RecordSvg from 'components/svg/RecordSvg'
import { useResize } from 'components/hooks/useResize'
import BackBtn from 'components/ui/BackBtn'
import { IUserProfile } from 'data/interfaces/IUser'



interface Props {
  onBackClick: () => void
}

export default function Messages(props: Props) {
  const dialog = useChatDialogContext()
  const {messages, loading, chat} = dialog
  const [pastedImages, setPastedImages] = useState<Map<string, File>>(new Map)
  const {isTabletWidth} = useResize()
  const [collocutor, setCollocutor] = useState<IUserProfile|any>(false)

  const userContext = useUserContext()
  const [value, setValue] = useState<string>('')

  const sendMessage = () => {
    if (!value.replace(/\s+/g, ' ').trim() && pastedImages.size === 0) {
      return
    }
    if(pastedImages.size === 0) {
      dialog.sendMessage({message:value, type: MessageType.Text})
    }
    else {
      dialog.sendMessage({message: value, type: MessageType.Asset}, {pastedImages: [...pastedImages.values()]})
    }
    setValue('')
    setPastedImages(state=> {
      state.clear()
      return new Map(state)
    })
  }

  const enterPressHandler = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      sendMessage()
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
          setPastedImages(state => new Map([...state.entries(), [fakeId, blob]]))
        }
      }
    }
  }

  const removeHandler = (key: string) => {
    setPastedImages(state=> {
      state.delete(key)
      return new Map(state)
    })
  }

  const isHirer = userContext?.currentProfile?.profileType === ProfileType.Hirer

  useEffect(()=>{
    if(dialog.chat) {
      setCollocutor(dialog.chat?.profiles[0]?.role === 'admin'?dialog.chat?.participant:dialog?.chat?.profile)
    }
  }, [dialog.chat])

  return (
    <div className={styles.root}> 
      <div className={styles.top}>
        {dialog.chat &&
        <>
          {isTabletWidth &&
            <BackBtn className={styles.backButton} onClick={props.onBackClick} bgColor={'transparent'}/>
          }
          <UserPic size={48} className={styles.userPic} image={collocutor?.image&& FILES + collocutor.image.source}/>
          <p className={styles.name}>{collocutor?collocutor?.firstName + ' ' + collocutor?.lastName: 'DELETED'}</p>
          <p className={styles.time}>В сети c {Formatter.formatDateRelative(collocutor?.lastActivityAt)}</p>
          {!isTabletWidth &&
            <ThreeDotsButton className={styles.dots}/>
          }
        </>
        ||
        <Spinner size={48} color={colors.yellow}/>
        }
      </div>
      <div className={styles.invite}>
        <p className={styles.invite__title}>{isHirer?'Отклик на вакансию':'Вас пригласили на вакансию'}</p>
        <p className={styles.invite__vacancy}>{dialog.chat?.proposal?.vacancy?.name||dialog.chat?.application?.vacancy?.name}</p>
        <InformationSvg className={styles.invite__info}/>
      </div>
      <div className={styles.messagesWrapper} id={'chat-messages'}
      ref={dialog.scrollableTarget as RefObject<HTMLDivElement>}
      >
      <InfiniteScroll
      dataLength={dialog.messages.size}
      next={dialog.fetchMore}
      scrollableTarget={'chat-messages'}
      inverse
      height={'100%'}
      style={{display: 'flex', flexDirection: 'column-reverse'}}
      loader={<Spinner size={24} color={colors.yellow}/>}
      hasMore={dialog.totalMessages > dialog.messages.size}
      scrollThreshold={0.6}>
        {
          messages.size>0&&[...messages.values()].map(el=> {
            return <MessageFactory profileId={userContext?.currentProfile?.id} message={el} application={chat?.application} />
          })
        }
      </InfiniteScroll>
      </div>
      <div className={styles.newMessage} onPaste={onPasteHandler}>
        <img src={'/icons/paperclip.svg'} alt='paperclip' className={styles.paperClip}/>
        {pastedImages.size>0 && 
        <div className={styles.imagesWrapper}>
          {[...pastedImages.entries()].map(([key, el]) => {
            return <div className={styles.image}><img src={URL.createObjectURL(el)}/> <Button onClick={()=>removeHandler(key)} className={styles.removeImage}><CloseTransparentSvg/></Button> </div>
          })}
        </div>
        }
        <input value={value} onChange={(e)=>{setValue(e.currentTarget.value)}} onKeyDown={(e)=>e.key==='Enter'&&enterPressHandler(e)} className={styles.input} type="text" placeholder='Введите сообщение...' />
        <div className={styles.microphoneWrapper} onClick={dialog.recordVoice}>
          {
          dialog.recorder?.current?.state === 'recording' &&
            <>
              <span>{Formatter.formatSecondtToTime(dialog.recordTime)}</span>
              <RecordSvg/>
            </>
            ||
            (value.length > 0 || pastedImages.size > 0) &&
            <img onClick={(e)=>{e.stopPropagation();sendMessage()}} src={'/icons/send.svg'} alt='send icon'/>
            ||
            <img src={'/icons/microphone.svg'} alt='microphone icon'/>
          }
        </div>
      </div>
    </div>
  )
}

