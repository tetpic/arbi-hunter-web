import { Editor } from '@tiptap/react'
import {Level} from '@tiptap/extension-heading'

import classNames from 'classnames'
import styles from './index.module.scss'
import {  Dispatch, ReactElement, SetStateAction, useCallback } from 'react'
import ItalicSvg from 'components/svg/ItalicSvg'
import BoldSvg from 'components/svg/BoldSvg'
import OrderListSvg from 'components/svg/OrderListSvg'
import UnorderedListSvg from 'components/svg/UnorderedListSvg'
import { Buttons } from '..'
import PhotoSvg from 'components/svg/PhotoSvg'
import FileRepository from 'data/repositories/FileRepository'
import { PreviewImage } from 'data/interfaces/Common'
import AlignLeftSvg from '@/components/svg/AlignLeftSvg'
import AlignCenterSvg from '@/components/svg/AlignCenterSvg'
import AlignRightSvg from '@/components/svg/AlignRightSvg'
import Button from '@/components/ui/Button'

interface Props {
  editor?: Editor | null
  onEditLink?: () => void
  hideButtons?: Buttons,
  onAddImage?: Dispatch<SetStateAction<PreviewImage[]>>
}

const HeadingButton = ({editor, level, path, children}: {editor: Editor, level: Level, path?: string, children: JSX.Element}) => (
  <ToolbarButton
  onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
  isActive={editor.isActive('heading', {level})}
  >
   {children}
  </ToolbarButton>
)

const TextAlignButton = ({editor, alignment, path, children}: {editor: Editor, alignment: string, path?: string, children: JSX.Element}) => (
  <ToolbarButton
  onClick={() => editor.chain().focus().setTextAlign(alignment).run()}
  isActive={editor.isActive('alignment', {alignment})}
  >
   {children}
  </ToolbarButton>

)

const ToolbarButton = ({onClick, children, isActive, disabled}: {onClick?: () => void, children: ReactElement, isActive?: boolean, disabled?: boolean}) => {
 return ( 
  <Button
  type='button'
  styleType={['icon', 'black']}
  altStyleType={['gradient']}
  
  onClick={!disabled ? onClick : undefined}
  className={classNames(styles.button, {[styles.active]: isActive, [styles.disabled]: disabled})}
  >
    {children}
  </Button>)
}


export default function RichTextToolbar(props: Props) {
  const {editor, onEditLink, hideButtons} = props

  const addImage = useCallback(() => {
    if(!props.onAddImage) {
      return
    }
    const input = document.createElement('input')
    input.type = 'file'
    input.name ='helper'
    input.click()
    input.addEventListener('change', (event: Event)=> {
      const target = event.target as HTMLInputElement
      const files = target.files
      for(const file of files) {
      try{        
        FileRepository.uploadFile(file)
        .then(fl => {
          props.onAddImage(state=> [...state, {image: file, loaded: true, id: fl.id}])
        })
      }
      catch(e) {
      }
    }
    })
  }, [editor])


  if(!editor){
    return null
  }


  return (<div className={styles.root}> 
  {!hideButtons?.bold &&
    <ToolbarButton
    onClick={() => editor.chain().focus().toggleBold().run()}
    isActive={editor.isActive('bold')}
    >   
      <BoldSvg className={styles.svg}/>   
    </ToolbarButton>
  }

  {!hideButtons?.italic && 
    <ToolbarButton
    onClick={() => editor.chain().focus().toggleItalic().run()}
    isActive={editor.isActive('italic')}
    >  
      <ItalicSvg className={styles.svg}/>   
    </ToolbarButton>
  }

  {/* <ToolbarButton
  onClick={() => editor.chain().focus().toggleUnderline().run()}
  isActive={editor.isActive('underline')}
  >
    <>{'underline'}</>
  </ToolbarButton> */}

  {!hideButtons?.headings?.find(e=> e===2) &&
    <HeadingButton editor={editor} level={2}>
      <>h2</>
    </HeadingButton>
  }

  {!hideButtons?.headings?.find(e=>e===3) &&
    <HeadingButton editor={editor} level={3}>
      <>h3</>
    </HeadingButton>
  }

  {!hideButtons?.headings?.find(e=>e===4) &&
    <HeadingButton editor={editor} level={4}>
      <>h4</>
    </HeadingButton>
  }

  {!hideButtons?.headings?.find(e=>e===5) &&
    <HeadingButton editor={editor} level={5}>
      <>h5</>
    </HeadingButton>
  }

  {!hideButtons?.headings?.find(e=>e===6) &&
    <HeadingButton editor={editor} level={6}>
      <>h6</>
    </HeadingButton>
  }

  <ToolbarButton
  onClick={() => editor.chain().focus().toggleOrderedList().run()}
  isActive={editor.isActive('orderedList')}
  ><>
    <OrderListSvg className={styles.svg}/>
  </>
  </ToolbarButton>

  <ToolbarButton
  onClick={() => editor.chain().focus().toggleBulletList().run()}
  isActive={editor.isActive('bulletList')}
  >
    <UnorderedListSvg className={styles.svg}/>
  </ToolbarButton>

  {!hideButtons.alignment &&<>
    <TextAlignButton editor={editor} alignment={'left'}>
      <AlignLeftSvg className={styles.svg}/>
    </TextAlignButton>

    <TextAlignButton editor={editor} alignment={'center'}>
      <AlignCenterSvg className={styles.svg}/>
    </TextAlignButton>

    <TextAlignButton editor={editor} alignment={'right'}>
      <AlignRightSvg className={styles.svg}/>
    </TextAlignButton>
  </>}
  
  {!hideButtons.color &&
    <ToolbarButton>
      <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}/>
    </ToolbarButton>
  }



  {!hideButtons?.helpers && <>
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
  </>}

  {props.onAddImage &&
    <ToolbarButton
    onClick={addImage}
    isActive={editor.isActive('orderedList')}
    >
      <PhotoSvg/>
    </ToolbarButton>
  }


  </div>)
}

