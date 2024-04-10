import styles from './index.module.scss'

import { usePersonalContext } from 'context/personal_state'
import EditableBlock from '../EditableBlock'
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import PointerExpandSvg from 'components/svg/PointerExpandSvg'
import Button from 'components/ui/Button'
import TrashBasketAltSvg from 'components/svg/TrashBasketAltSvg'
import EditSvg from 'components/svg/EditSvg'
import classNames from 'classnames'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { IAddPersonalBlockModalProps } from 'components/modals/AddPersonalBlockModal'
import { IFile } from 'data/interfaces/Common'
import { IPersonalPageBlock } from 'data/interfaces/IPersonal'

interface Props {
  isEditing?: boolean
}


export default function PersonalBody(props: Props) {
  const personalContext = usePersonalContext()
  const appContext = useAppContext()
  const {blocks, setBlocks} = personalContext

  const swapElements = (arr: any[], index1: number, index2: number) => {
    const temp = arr[index1]
    arr[index1] = arr[index2]
    arr[index2] = temp
    return arr
  }

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const sorted = swapElements([...blocks.entries()], oldIndex, newIndex)
    setBlocks(new Map(sorted))
  }

  const removeBlock = (order: number) => {
    setBlocks(state=> {
      const newState = new Map(state)
      newState.delete(order)
      return newState
    })
  }

  const editBlock = (order: number) => {
    const currentBlock = blocks.get(order)
    appContext.showModal<IAddPersonalBlockModalProps>(ModalType.AddPersonalBlockModal, {
      type: currentBlock.block.type,
      initialData: {block: currentBlock.block, assets: currentBlock.assets},
      onSubmit: (data, images) => {
        setBlocks(state=> new Map([...state, [order, {block: data as IPersonalPageBlock, assets: images as IFile[]}]]))
      }
    })
  }


  return (<div className={styles.root}> 
    <SortableList onSortEnd={onSortEnd}>
    {blocks.size > 0 &&
      [...blocks.entries()].map(([order, {block, assets}], i) => {
        return <SortableItem key={i}>
          <div className={classNames(styles.item, props.isEditing&&styles.item_edit)}>
            <div className={classNames(styles.buttonsWrapper, props.isEditing && styles.buttonsWrapper_active)}>
              <SortableKnob>
                <Button className={styles.button}  altStyleType={['gradient']}><PointerExpandSvg/></Button>
              </SortableKnob>
              <Button className={classNames(styles.button, styles.trash)} altStyleType={['gradient']} onClick={() => removeBlock(order)}><TrashBasketAltSvg/></Button>
              <Button className={styles.button}  altStyleType={['gradient']} onClick={() => {editBlock(order)}}><EditSvg/></Button>
            </div>
            <EditableBlock  block={block} assets={assets}/>
          </div>
        </SortableItem>
      })
    }
    </SortableList>
  </div>)
}