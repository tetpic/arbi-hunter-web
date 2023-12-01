import styles from './index.module.scss'

import { ICategory } from 'data/interfaces/Common'
import classNames from 'classnames'
import AppSvg from 'components/svg/AppSvg'
import { colors } from 'styles/variables'

interface Props {categories: ICategory[], currentCategory: ICategory, setCurrent: (e: ICategory)=>void}



export default function SubCategories(props: Props) {
  return (
    props.categories.map(el=> {
      const isCurrent = el.id === props.currentCategory?.id
      return <p  key={el.id} className={classNames(styles.subCategory, isCurrent&&styles.subCategory_active)} onClick={()=> props.setCurrent(el)}><AppSvg color={isCurrent&&colors.yellow} />{el.name}</p>
    })
  )
}