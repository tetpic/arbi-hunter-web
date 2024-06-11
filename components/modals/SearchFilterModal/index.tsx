import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import TagList from 'components/ui/TagList'
import { ICategory } from 'data/interfaces/Common'
import { useAppContext } from 'context/state'
import Spacer from 'components/ui/Spacer'
import { useState } from 'react'
import Button from 'components/ui/Button'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: ()=>void
  isBottomSheet?: boolean
}

export interface ISearchFilterModalProps {
  categories: ICategory[]
  activeCategories: number[],
  periods: {name: string, value: number}[],
  activePeriod: number,
  onSubmit?: (data: {categories: ICategory[], period: number})=>void
  
}

export default function SearchFilterModal(props: Props) {
  const appContext = useAppContext()
  const {t} = useTranslation()
  const args:ISearchFilterModalProps =props.isBottomSheet?appContext.bottomSheetArguments: appContext.modalArguments
  const [categories, setCategories] = useState<[ICategory, boolean][]>(args.categories&&args.categories.map(el=>[el, args.activeCategories.includes(el.id)]))
  const [periods, setPeriods] = useState<[{name: string, value: number}, boolean][]>(args.periods.map(el=>[el, args.activePeriod===el.value]))


  const submit = ()=>{
    const dataTosend = {
      categories: categories?.filter(el=>el[1]).map(el=>el[0]),
      period: periods?.find(el=>el[1])?.[0].value
    }
    args.onSubmit(dataTosend)
    props.onClose()
  }


  const body = (<>
    {args.categories &&
    <>
      <TagList 
      title={t('categories')} 
      titleClassName={styles.title}
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
      />
      <Spacer basis={16}/>
    </>
    }

    <TagList 
    title={t('period')} 
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
      <Button className={styles.cancel} onClick={props.onClose}>{t('cancel')}</Button>
      <Button className={styles.accept} onClick={submit}>{t('continue')}</Button>
    </div>
  </>)

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          {body}
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}