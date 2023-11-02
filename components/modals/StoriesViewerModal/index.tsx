import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import { IArticle } from 'data/interfaces/IArticle'
import { useAppContext } from 'context/state'
import { useEffect, useRef, useState } from 'react'
import { IArticleBlock } from 'data/interfaces/Common'
import classNames from 'classnames'
import Image from 'next/image'
import { FILES } from 'types/constants'
import UserPic from 'components/ui/UserPic'
import TextNode from 'components/ui/TextNode'
import Button from 'components/ui/Button'
import CrossSvg from 'components/svg/CrossSvg'

interface Props {
  onClose: ()=>void
}

export interface IStoriesViewerProps {
  stories: IArticle[],
  currentStory: IArticle
}

function StoriesProgress(props: {counter:number, item: number, time?: number}) {

  const items:number[] = (()=>{
    let arr: number[] = []
    for(let i = props.counter; i >= 0; i--) {
      arr.push(i)
    }
    arr.reverse()
    return arr
  })()

  return (
    <div className={styles.progressRoot}>
      {props.time &&items.map((el)=> {
        return (
          <div key={`${el + Math.random()}`} style={{width: `${~~100/items.length}%`}} className={styles.progressItem}>
            <div style={{animationDuration: `${props.time}s`}} className={classNames(styles.progress, props.item === el&&styles.progressActive)}></div>
          </div>
        )
      })}
    </div>
  )
}



export default function StoriesViewerModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as IStoriesViewerProps
  const timeoutRef = useRef<number>(null!)
  const [currentStory, setCurrentStory] = useState<{story: IArticle, index: number}>({
    index: args.stories.findIndex(el=> el.id===args.currentStory.id),
    story: args.currentStory
  })
  const [currentBlock, setCurrentBlock] = useState<{block: IArticleBlock, position: number}>({
    block: args.currentStory.blocks[0], 
    position:0
  })

  const defaultStoryDuration = 10

  const nextHandler = () => {
    if(currentBlock.position < currentStory.story.blocks.length -1) {
      setCurrentBlock({block: currentStory.story.blocks[currentBlock.position+1], position: currentBlock.position+1})
    }
    else if(currentStory.index < args.stories.length - 1) {
      const nextStory = args.stories[currentStory.index + 1]
      const nextStoryBlocks = nextStory.blocks
      setCurrentStory({story: args.stories[currentStory.index +1], index: currentStory.index +1})
      setCurrentBlock({block: nextStoryBlocks[0], position: 0})
    }
    else {
      appContext.hideModal()
    }
  }

  const prevHandler = () => {
    if(currentBlock.position > 0) {
      setCurrentBlock({block: currentStory.story.blocks[currentBlock.position-1], position: currentBlock.position-1})
    }
    else if(currentStory.index > 0) {
      const prevStory = args.stories[currentStory.index-1]
      const prevStoryBlocks = prevStory.blocks
      setCurrentStory({story: args.stories[currentStory.index-1], index: currentStory.index-1})
      setCurrentBlock({block: prevStoryBlocks[prevStoryBlocks.length -1], position: prevStoryBlocks.length -1})
    }
    else {
      appContext.hideModal()
    }
  }

  useEffect(()=>{
    clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(()=>{nextHandler()}, currentBlock.block.image?.duration*1000||defaultStoryDuration*1000)
    return(()=>{
      clearTimeout(timeoutRef.current)
    })
  }, [currentBlock])

  const body = (<>
    <StoriesProgress counter={currentStory.story.blocks.length-1} item={currentBlock.position} time={currentBlock.block.image?.duration||defaultStoryDuration}/>
    <Button stopPropagation className={styles.closeButton} onClick={(e)=> {e.stopPropagation();props.onClose()}}><CrossSvg/></Button>
    <div className={styles.block}>
      {
      (currentBlock.block.image.type === 'IMAGE' || currentBlock.block.image.type === 'BINARY') &&
      <>
        <Image className={styles.mainImage} src={FILES + currentBlock.block.image.source} alt={''} width={600} height={800} style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
        <Image className={styles.imageBackground} src={FILES + currentBlock.block.image.source} alt={''} width={600} height={800} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
      </>
      ||
      currentBlock.block.image.type === 'VIDEO' &&
        <video autoPlay playsInline src={FILES + currentBlock.block.image.source}/>
      }
      <div className={styles.navigation}>
        <div className={styles.prev} onClick={prevHandler}></div>
        <div className={styles.next} onClick={nextHandler}></div>
      </div>

      <div className={styles.description}>
        <UserPic className={styles.userPic} size={32} image={FILES + currentStory.story.image.source}/>
        <p className={styles.title}>{currentBlock.block.title||'TITLE'}</p>
        {currentBlock.block.body &&
          <p className={styles.body}><TextNode html={currentBlock.block.body}/></p>
        }
      </div>

    </div>
   
  </>)

  return (
    <ModalLayout mobileFullScreen className={styles.modalLayout}>
      <ModalBody className={styles.modalBody}>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}