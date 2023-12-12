import styles from './index.module.scss'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import Underline from '@tiptap/extension-underline'
import {Placeholder} from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'

import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

import { useField } from 'formik'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IField } from 'types/types'
import FieldError from 'components/ui/FieldError'
import RichTextToolbar from './RichTextToolbar'
import Image from '@tiptap/extension-image'
import { PreviewImage } from 'data/interfaces/Common'

interface IBubbleShowProps {
  editor: Editor,
  view: EditorView,
  state: EditorState,
  oldState?: EditorState,
  from: number,
  to: number
}

export interface Buttons {
  bold?: boolean,
  italic?: boolean,
  headings?: number[],
  ol?: boolean,
  ul?: boolean,
  helpers?: boolean
}

interface Props extends IField<string | null>{
  className?: string
  value?: string,
  onAddImage?: Dispatch<SetStateAction<PreviewImage[]>>
  hideButtons?: Buttons
  returnValueType?: 'json'|'html'
}

export default function RichTextField(props: Props) {
  const {label, placeholder, className} = props
  const [field, meta, helpers] = useField(props as any)
  const {value} = field
  const [focus, setFocus] = useState(false)

  const shouldShowBubble = ({ editor, view, state, oldState, from, to }: IBubbleShowProps) => {
    return editor.isActive('link')
  }

  // const handleEditLink = () => {
  //   const details = getLinkDetails(editor!)
  //   const data: RichTextLinkModalArguments = {
  //     href: details.href,
  //     title: details.title,
  //     onCancel: () =>  appContext.isMobile ? appContext.hideBottomSheet() : appContext.hideModal(),
  //     onSubmit: (link: IRichTextLinkData) => {
  //       insertLink(editor!, link)
  //       setTimeout(() => editor!.commands.focus(), 100)
  //       appContext.isMobile ? appContext.hideBottomSheet() : appContext.hideModal()
  //     }
  //   }
  //     appContext.showModal(ModalType.richTextLink, data)
  // }
  

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2,3,4,5,6]
        },
        code: false,
        codeBlock: false,
      }),

      Image.configure({}),
      Underline,
      Placeholder.configure({
        emptyEditorClass: 'emptyText',
        placeholder: 'Введите текст',
      }),
      Link.extend({

      }).configure({
        openOnClick: false,
        autolink: false,
        HTMLAttributes: {
          target: null,
          rel: null
        }
      }),
    ],
    content: props.value||value,
    onUpdate: ({editor}) => {
      if(props.returnValueType) {
        switch(props.returnValueType){
          case 'html':
            helpers.setValue(editor.getHTML())
            break
          case 'json':
            helpers.setValue(editor.getJSON())
            break
        }
      }
      else {
        helpers.setValue(editor.getHTML())
      }
      setFocus(false)
    },
    onFocus: () => {
      setFocus(true)
    }
  })

  useEffect(()=>{
    if(editor) {
      editor.commands.clearContent()
      editor.commands.insertContent(props.value)
    }
  }, [/*props.value, editor*/])

  const hasError = !!meta.error && meta.touched

  return (
    <div className={styles.root}> 
      <div className={styles.field}>
        <RichTextToolbar editor={editor} onAddImage={props.onAddImage} hideButtons={props.hideButtons}/>
        <div className={styles.editor}>
          <EditorContent editor={editor} />
        </div>
      </div>
      <FieldError showError={hasError}>{meta.error}</FieldError>
    </div>
  )
}