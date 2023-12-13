import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import TagList from 'components/ui/TagList'
import { ICategory } from 'data/interfaces/Common'
import { useAppContext } from 'context/state'
import Spacer from 'components/ui/Spacer'
import { useState } from 'react'
import Button from 'components/ui/Button'

interface Props {
  onClose: ()=>void
}

export interface ISearchFilterModalProps {
  categories: ICategory[]
  activeCategories: number[],
  periods: {name: string, value: number}[],
  activePeriod: number,
  setCategories: (data: ICategory[]) => void
  setPeriod: (data: number)=>void
}

export default function SearchFilterModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as ISearchFilterModalProps
  const [categories, setCategories] = useState<[ICategory, boolean][]>(args.categories.map(el=>[el, args.activeCategories.includes(el.id)]))
  const [periods, setPeriods] = useState<[{name: string, value: number}, boolean][]>(args.periods.map(el=>[el, args.activePeriod===el.value]))


  const submit = ()=>{
    args.setCategories(categories.filter(el=>el[1]).map(el=>el[0]))
    args.setPeriod(periods.find(el=>el[1])?.[0].value||undefined)
    props.onClose()
  }


  const body = (<>
    <TagList 
    title={'Категории'} 
    tags={
      categories.map(([el, isActive])=>({
      name: el.name,
      isActive,
      onClick: ()=>{
        setCategories(_=> {
          const indexFound = categories.findIndex(e=> e[0].id === el.id)
          categories[indexFound][1] = !isActive
          return [...categories]
        })
      }
    }))} 
    titleClassName={styles.title}/>

    <Spacer basis={16}/>

    <TagList 
    title={'Период'} 
    tags={
      periods.map(([el, isActive])=>({
        name: el.name,
        isActive,
        onClick: ()=>{
          setPeriods(_=> {
            const indexFound = periods.findIndex(e=> e[0].value === el.value)
            const clear: any = periods.map(el=>[el[0], false]) 
            clear[indexFound][1] = !isActive
            return [...clear]
          })
        }
      }))
    } 
    titleClassName={styles.title}/>

    <div className={styles.buttonsWrapper}>
      <Button className={styles.cancel} onClick={props.onClose}>Отменить</Button>
      <Button className={styles.accept} onClick={submit}>Применить</Button>
    </div>
  </>)

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}