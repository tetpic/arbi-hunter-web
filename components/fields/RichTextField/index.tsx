import styles from './index.module.scss'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'


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
import classNames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'

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
  helpers?: boolean,
  alignment?: boolean,
  color?: boolean,
  link?: boolean
}

interface Props extends IField<string | null>{
  className?: string
  value?: string,
  onAddImage?: Dispatch<SetStateAction<PreviewImage[]>>
  hideButtons?: Buttons
  returnValueType?: 'json'|'html'
  placeholderClassName?: string
  editorClassName?: string
  labelClassName?: string
}

export default function RichTextField(props: Props) {
  const {t} = useTranslation()
  const {label, placeholder, className} = props
  const [field, meta, helpers] = useField(props as any)
  const {value} = field
  const [focus, setFocus] = useState(false)
  const appContext = useAppContext()
  const isLightTheme = appContext?.theme === AppTheme.Light

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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      TextStyle.configure({
        HTMLAttributes: {style: {color: 'white'}}
      }), 
      Color.configure({
        types: ['textStyle'],
      }),
      

      Image.configure({}),
      Underline,
      Placeholder.configure({
        emptyEditorClass: props.placeholderClassName||'emptyText',
        placeholder: props.placeholder||t('fields_insertText'),
      }),
      Link.extend({

      }).configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          target: '_blank',
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
      <div className={classNames(styles.field, className) }>
        <RichTextToolbar editor={editor} onAddImage={props.onAddImage} hideButtons={props.hideButtons}/>
        <div className={classNames(styles.editor, props.editorClassName, !focus&&props.label&&styles.focused, isLightTheme&&styles.editor_light)}>
          {!focus &&
            <p className={classNames(styles.label, props.labelClassName)}>{props.label}</p>
          }
          <EditorContent editor={editor} />
        </div>
      </div>
      <FieldError showError={hasError}>{meta.error}</FieldError>
    </div>
  )
}