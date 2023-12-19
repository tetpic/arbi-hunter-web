import styles from './index.module.scss'

import classNames from 'classnames'
import AppSvg from 'components/svg/AppSvg'
import { colors } from 'styles/variables'

interface Props<T> {
  categories: T[], 
  currentCategory: T, 
  setCurrent: (e: T)=>void
}



export default function SubNavigationSet<T extends {id: number, name: string}>(props: Props<T>) {
  return (
    props.categories.map(el=> {
      const isCurrent = el.id === props.currentCategory?.id
      return <p  key={el.id} className={classNames(styles.subCategory, isCurrent&&styles.subCategory_active)} onClick={()=> props.setCurrent(el)}><AppSvg color={isCurrent&&colors.yellow} />{el.name}</p>
    })
  )
}