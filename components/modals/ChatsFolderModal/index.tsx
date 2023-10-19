import styles from './index.module.scss'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import IChat from 'data/interfaces/IChat'
import UserPic from 'components/ui/UserPic'
import Checkbox from 'components/fields/CheckboxListField/Checkbox'
import { useState } from 'react'

interface Props {
  onClose: () => void
}

export default function ChatsFolderModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as {chats: IChat[], onSave: (a: IChat[])=>void}
  const [chats, setChats] = useState<Map<IChat, boolean>>(new Map(args.chats.map(el=> [el, false])))

  const onSaveHandler = () => {
    const choosen = new Map([...chats.entries()].filter(([key, value]) => value===true))
    args.onSave([...choosen.keys()])
    props.onClose()
  }


  const top = (
    <div className={styles.top}>
      <Button className={styles.button} /*onClick={} */>Отмена</Button>
      <p className={styles.title}>Чат в папке</p>
      <Button className={styles.buttonBlue} onClick={onSaveHandler}>Готово</Button>
    </div>
  )

  const checkHandler = (c: IChat, isActive: boolean) => {
    setChats(state=> {
      state.set(c, !isActive)
      return new Map([...state])
    })
  }

  const body = (
    <div className={styles.body}>
      {[...chats.entries()].map(([chat, isActive])=> {
        const collocutor = chat.profiles[0].role === 'admin'?chat.participant:chat.profile
        return (
          <div className={styles.item} key={chat.id} onClick={(e)=>{e.stopPropagation(); checkHandler(chat, isActive)}}>
            <UserPic className={styles.userPic}/>
            <p className={styles.name}>{collocutor.firstName} {collocutor.lastName}</p>
            <p className={styles.vacancy}>test</p>
            <Checkbox className={styles.checkBox} value={chat.id} isActive={isActive} onChange={()=>checkHandler(chat, isActive)}/>
          </div>
        )
      })}
    </div>
  )

  return (
  <ModalLayout className={styles.layout}>
    <ModalBody>
      {top}
      {body}
    </ModalBody>
  </ModalLayout>)
}