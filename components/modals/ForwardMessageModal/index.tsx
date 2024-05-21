import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import { useAppContext } from 'context/state'
import IChat, { IMessage } from 'data/interfaces/IChat'
import P from '@/components/ui/P'
import UserPic from '@/components/ui/UserPic'
import Formatter from 'utils/formatter'
import useTranslation from 'next-translate/useTranslation'
import { InterfaceLanguage, Preset } from 'types/enums'
import { useState } from 'react'
import { getUserImageSource } from 'utils/helpers'
import { Form, FormikProvider, useFormik } from 'formik'
import TextAreaField from '@/components/fields/TextAreaField'
import Button from '@/components/ui/Button'
import MessageFactory from '@/components/for_pages/messenger/Messages/MessageFactory'
import ChatRepository from 'data/repositories/ChatRepository'
import { useRouter } from 'next/router'
import CrossSvg from '@/components/svg/CrossSvg'

interface Props {
  onClose?: () => void
  isBottomSheet?: boolean
}

export interface ForwardMessageModalArgs  {
  forwardedId: number,
  chats: IChat[],
  forwardedMessage?: IMessage
  forwardedMessagesList?: number[]
  onSend?: (chatId: number) => void
}

export default function ForwardMessageModal(props: Props) {
  const {t, lang} = useTranslation()
  const appContext = useAppContext()
  const args:ForwardMessageModalArgs = appContext.modalArguments
  const [currentChat, setCurrentChat] = useState<IChat>()
  const [currentPage, setCurrentPage] = useState<'chats'|'message'>('chats')
  const collocutor = currentChat?.profiles[0]?.role === 'admin'?currentChat?.participant:currentChat?.profile
  const router = useRouter()

  const submit = (data: {chatId: number|null, message: string}) => {
    if(args.forwardedMessagesList) {
      args.onSend(data.chatId)
    }
    else {
      ChatRepository.createMessage({message: data.message, chatId: data.chatId, forwardedId: args.forwardedId})
      .then(_ => {
        args.onSend(data.chatId)
        // appContext.hideModal()
      })
    }
  }

  const formik = useFormik<{chatId: number|null, message: string}>({
    initialValues:{
      chatId: null,
      message: '',
    },
    onSubmit: submit
  })

  


  const body = (
    <div className={styles.root}>
      <div className={styles.top}>
        <P useThemeColor styleType={['large', 'w600']}>Отправить...</P>
        <Button 
        styleType={['icon', 'circle','backTransparent']} 
        altStyleType={['icon','circle', 'backTransparent', 'invertSvg']}
        onClick={props.onClose}
        >
          <CrossSvg/>
        </Button>
      </div>
      <div className={styles.chats}>
        {args.chats.map((el, index)=>{
          const _collocutor = el.profiles[0]?.role === 'admin'?el.participant:el.profile
          return <div className={styles.chat} onClick={()=>{setCurrentChat(el); setCurrentPage('message'); formik.setFieldValue('chatId', el.id)}}>
            <UserPic image={getUserImageSource(_collocutor, Preset.smallIconCrop)}/>
            <div className={styles.chatInfo}>
              <P styleType={['medium', 'w500']} useThemeColor>{_collocutor?_collocutor?.firstName + ' ' + _collocutor?.lastName:'DELETED'}</P>
              {_collocutor.lastActivityAt &&
                <P styleType={['small', 'w500', 'greyLight']} useThemeColor>{Formatter.formatDate(_collocutor.lastActivityAt, {lang: lang as InterfaceLanguage})}</P>
              }
            </div>
          </div>
        })}
      </div>
     
    </div>
  )

  const message = (
    <div className={styles.root}>
       <div className={styles.top}>
       <P useThemeColor styleType={['large', 'w600']}>Сообщение</P>
        <Button 
        styleType={['icon', 'circle','backTransparent']} 
        altStyleType={['icon','circle', 'backTransparent', 'invertSvg']}
        onClick={props.onClose}
        >
          <CrossSvg/>
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.chat}>
          <UserPic image={getUserImageSource(collocutor, Preset.smallIconCrop)}/>
          <div className={styles.chatInfo}>
            <P styleType={['medium', 'w500']} useThemeColor>{collocutor?collocutor?.firstName + ' ' + collocutor?.lastName:'DELETED'}</P>
            {collocutor?.lastActivityAt &&
              <P styleType={['small', 'w500', 'greyLight']} useThemeColor>{Formatter.formatDate(collocutor?.lastActivityAt, {lang: lang as InterfaceLanguage})}</P>
            }
          </div>
        </div>
        {args.forwardedMessagesList?.length > 0 &&
          <P style={{paddingBlock: '10px'}} styleType={['medium', 'w500']} useThemeColor>Переслать {args.forwardedMessagesList?.length} сообщений</P>
        } 
        {args.forwardedMessage && <>
          <div className={styles.message}>
            <MessageFactory profileId={0} message={args.forwardedMessage} application={undefined}/>
          </div>
          <P useThemeColor styleType={['medium', 'w500']} className={styles.subTitle}>Комментарий</P>
          <FormikProvider value={formik} >
            <Form className={styles.form}>
              <TextAreaField name={'message'}
              autoSize
              onChange={formik.handleChange}
              />
            </Form>
          </FormikProvider>
        </>}
        <div className={styles.buttonsWrapper}>
          <Button styleType={['grey', 'phoneWide']} onClick={()=>{setCurrentPage('chats')}} altStyleType={['white']}>{t('back')}</Button>
          <Button styleType={['gradient', 'phoneWide']} onClick={formik.submitForm}>{t('send')}</Button>
        </div>
      </div>
    </div>
  )

  return (<ModalLayout mobileFullScreen>
    <ModalBody className={styles.modalBody}>
      {currentPage === 'chats' 
      ?body
      :message

      }
    </ModalBody>
  </ModalLayout>)
}