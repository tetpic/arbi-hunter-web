import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import InformationSvg from 'components/svg/InformationSvg'
import MicrophoneSvg from 'components/svg/MicrophoneSvg'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import MessageFactory from './MessageFactory'
import { RefObject, useState } from 'react'
import { useChatDialogContext } from 'context/chat_dialog_state'
import { MessageType } from 'types/enums'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import Button from 'components/ui/Button'
import {v4 as uuidv4} from 'uuid'
import CloseTransparentSvg from 'components/svg/CloseTransparentSvg'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './index.module.scss'


interface Props {
}

export default function Messages(props: Props) {
  const dialog = useChatDialogContext()
  const {messages, loading} = dialog
  const [pastedImages, setPastedImages] = useState<Map<string, File>>(new Map)

  const userContext = useUserContext()
  const [value, setValue] = useState<string>('')

  const sendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!value.replace(/\s+/g, ' ').trim() && pastedImages.size === 0) {
      return
    }
    if(e.key === 'Enter') {
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
  }

  const onPasteHandler = (e: React.ClipboardEvent<HTMLDivElement>) => {
    //https://stackoverflow.com/questions/6333814/how-does-the-paste-image-from-clipboard-functionality-work-in-gmail-and-google-c
    const items = e.clipboardData.items
    for (let index in items) {
      let item = items[index]
      const fakeId = uuidv4()
      if (item.kind === 'file') {
        const blob = item.getAsFile()
        if(blob.type === 'image/png' || blob.type === 'image.jpeg' || blob.type === 'image/jpg') {
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

  return (
    <div className={styles.root}> 
      <div className={styles.top}>
        <UserPic size={48} className={styles.userPic} image={dialog.chat.profile?.image&& FILES + dialog?.chat.profile.image.source}/>
        <p className={styles.name}>{dialog.chat?.profile.company||dialog.chat?.profile.firstName + ' ' + dialog.chat?.profile.lastName}</p>
        <p className={styles.time}>В сети c {Formatter.formatDateRelative(dialog.chat?.profile.lastActivityAt)}</p>
        <ThreeDotsButton className={styles.dots}/>
      </div>
      {userContext?.currentProfile?.profileType === ProfileType.Employee &&
        <div className={styles.invite}>
          <p className={styles.invite__title}>Вас пригласили на вакансию</p>
          <p className={styles.invite__vacancy}>{dialog.chat?.application?.cv?.position}</p>
          <InformationSvg className={styles.invite__info}/>
        </div>
      }
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
              return <MessageFactory profileId={userContext.currentProfile.id} message={el}/>
            })
            ||
            !loading &&<p className={'empty'} style={{marginBottom: 24}}>Нет сообщений</p>
          
          }
      </InfiniteScroll>
      </div>
      <div className={styles.newMessage} onPaste={onPasteHandler}>
        <div className={styles.imagesWrapper}>
          {pastedImages.size>0 && [...pastedImages.entries()].map(([key, el]) => {
            return <div className={styles.image}><img src={URL.createObjectURL(el)}/> <Button onClick={()=>removeHandler(key)} className={styles.removeImage}><CloseTransparentSvg/></Button> </div>
          })}
        </div>
        <input value={value} onChange={(e)=>{setValue(e.currentTarget.value)}} onKeyDown={(e)=>e.key==='Enter'&&sendMessage(e)} className={styles.input} type="text" placeholder='Введите сообщение...' />
        <MicrophoneSvg/>
      </div>
    </div>
  )
}

// {!loading && !chatContext.disabled && <InfiniteScroll
//   dataLength={chatContext.messages.length}
//   next={chatContext.fetchMore}
//   scrollableTarget={'chat-messages'}
//   inverse
//   style={{overflow: 'inherit'}}
//   className={styles.list}
//   loader={chatContext.totalMessages > 0 ? <ContentLoader style={'infiniteScroll'} isOpen={true}/> : null}
//   hasMore={chatContext.totalMessages > chatContext.messages.length}
//   scrollThreshold={0.6}>
//   {chatContext.messages.map((i, index) => {
//     const previous = index > 0 ? chatContext.messages[index - 1] : null
//     return (<>
//       {previous && previous.userId !== i.userId && <Spacer basis={10}/>}
//       <ChatMessage key={i.sid ?? i.id} side={appContext.aboutMe?.id === i.userId ? 'my' : 'other'}
//                    message={i}/></>)
//   })}
// </InfiniteScroll>}
