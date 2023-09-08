import styles from './index.module.scss'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import Underline from '@tiptap/extension-underline'
import {Placeholder} from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'

import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

import { useField } from 'formik'
import { useState } from 'react'
import { IField } from 'types/types'
import FieldError from 'components/ui/FieldError'
import RichTextToolbar from './RichTextToolbar'

interface IBubbleShowProps {
  editor: Editor,
  view: EditorView,
  state: EditorState,
  oldState?: EditorState,
  from: number,
  to: number
}

interface Props extends IField<string | null>{
  className?: string
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

      Underline,
      Placeholder.configure({
        emptyEditorClass: 'empty',
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
    content: value,
    onBlur: ({editor}) => {
      helpers.setValue(editor.getHTML())
      setFocus(false)
    },
    onFocus: () => {
      setFocus(true)
    }
  })

  const hasError = !!meta.error && meta.touched

  return (<div className={styles.root}> 
  <div className={styles.field}>

    <RichTextToolbar editor={editor}/>
    <div className={styles.editor}>
      <EditorContent editor={editor} />
    </div>
  </div>
  <FieldError showError={hasError}>{meta.error}</FieldError>

  </div>)
}