import { Editor } from '@tiptap/react'
import {Level} from '@tiptap/extension-heading'

import classNames from 'classnames'
import styles from './index.module.scss'
import { ReactElement } from 'react'
import ItalicSvg from 'components/svg/ItalicSvg'
import BoldSvg from 'components/svg/BoldSvg'
import OrderListSvg from 'components/svg/OrderListSvg'
import UnorderedListSvg from 'components/svg/UnorderedListSvg'

interface Props {
  editor?: Editor | null
  onEditLink?: () => void
}

const HeadingButton = ({editor, level, path, children}: {editor: Editor, level: Level, path?: string, children: JSX.Element}) => (
  <ToolbarButton
  onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
  isActive={editor.isActive('heading', {level})}
  >
   {children}
  </ToolbarButton>
)

const ToolbarButton = ({onClick, children, isActive, disabled}: {onClick: () => void, children: ReactElement, isActive?: boolean, disabled?: boolean}) => {
 return ( 
  <div
  onClick={!disabled ? onClick : undefined}
  className={classNames(styles.button, {[styles.active]: isActive, [styles.disabled]: disabled})}
  >
    {children}
  </div>)
}


export default function RichTextToolbar({editor, onEditLink}: Props) {
  if(!editor){
    return null
  }

  return (<div className={styles.root}> 
  <ToolbarButton
  onClick={() => editor.chain().focus().toggleBold().run()}
  isActive={editor.isActive('bold')}
  >   
    <BoldSvg className={styles.svg}/>   
  </ToolbarButton>

  <ToolbarButton
  onClick={() => editor.chain().focus().toggleItalic().run()}
  isActive={editor.isActive('italic')}
  >  
    <ItalicSvg className={styles.svg}/>   
  </ToolbarButton>

  {/* <ToolbarButton
  onClick={() => editor.chain().focus().toggleUnderline().run()}
  isActive={editor.isActive('underline')}
  >
    <>{'underline'}</>
  </ToolbarButton> */}

  <HeadingButton editor={editor} level={2}>
    <>h2</>
  </HeadingButton>

  <HeadingButton editor={editor} level={3}>
    <>h3</>
  </HeadingButton>

  <HeadingButton editor={editor} level={4}>
    <>h4</>
  </HeadingButton>

  <HeadingButton editor={editor} level={5}>
    <>h5</>
  </HeadingButton>

  <HeadingButton editor={editor} level={6}>
    <>h6</>
  </HeadingButton>

  <ToolbarButton
  onClick={() => editor.chain().focus().toggleOrderedList().run()}
  isActive={editor.isActive('orderedList')}
  >
   <OrderListSvg className={styles.svg}/>
  </ToolbarButton>

  <ToolbarButton
  onClick={() => editor.chain().focus().toggleBulletList().run()}
  isActive={editor.isActive('bulletList')}
  >
    <UnorderedListSvg className={styles.svg}/>
  </ToolbarButton>

  <ToolbarButton
  onClick={()=>editor.commands.insertContent('{{cv.profile.firstName}} {{cv.profile.lastName}}')}
  isActive={editor.isActive('CVUserName')}
  >
    <>CV UserName</>
  </ToolbarButton>

  <ToolbarButton
  onClick={()=>editor.commands.insertContent('{{vacancy.contactName}}')}
  >
    <>HR Name</>
  </ToolbarButton>

  <ToolbarButton 
   onClick={()=>editor.commands.insertContent('{{vacancy.name}}')}
  >
    <>VC Name</>
  </ToolbarButton>


  </div>)
}