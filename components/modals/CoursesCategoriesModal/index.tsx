import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import { useAppContext } from 'context/state'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ICategory } from 'data/interfaces/Common'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { CategoryType, Preset } from 'types/enums'
import Spinner from 'components/ui/Spinner'
import Title from 'components/ui/TitleForSection'
import Image from 'next/image'
import Formatter from 'utils/formatter'
import ImageHelper from 'utils/ImageHelper'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: () => void
}

export interface ICoursesCategoriesModalProps {
  onCategoryClick: (categoryId: number) => void
}

export default function CoursesCategoriesModal(props: Props) {
  const appContext = useAppContext()
  const args: ICoursesCategoriesModalProps = appContext.modalArguments
  const [categories, setCategories] = useState<Map<number, ICategory>>(new Map)
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const {t} = useTranslation()

  const onCategoryClick = (categoryId: number) => {
    args.onCategoryClick(categoryId)
    props.onClose()
  }

  useEffect(()=>{
    setLoading(true)
    ArticlesRepository.getCategoryList({categoryType: CategoryType.Course, page, limit: 10})
    .then(res=> {
      setCategories(state=> {
        res.data.forEach(c => {
          state.set(c.id, c)
        })
        return state
      })
      setTotal(res.total)
      setLoading(false)
    })  
  }, [page])

  const body = (
    <div className={styles.root}>
      <Title title={t('courses_categories')} onBackClick={props.onClose}/>
      <InfiniteScroll 
      next={()=>setPage(p => p+1)} 
      hasMore={categories.size < total} 
      loader={<Spinner size={24}/>} 
      dataLength={total}>
        <div className={styles.categoriesWrapper}>
          {categories.size > 0 &&
            [...categories.values()].map(category => {
              return (
                <div className={styles.item} key={category.id} onClick={()=>onCategoryClick(category.id)}>
                  <p className={styles.title}>{category.translations[0].name}</p>
                  <p className={styles.counter}>
                    <span>
                    {category.coursesCount}&nbsp;
                    {Formatter.pluralize(Number(category.coursesCount), t('course1'), t('course2'), t('course3'))}
                    </span>
                  </p>
                  {category.image &&
                  <Image 
                  unoptimized
                  src={ImageHelper.urlFromFile(category.image, Preset.xsResize)} 
                  alt={'category image'} 
                  width={100} 
                  height={100}/>
                  }
                  
                </div>
              )
            })
          }
        </div>
      </InfiniteScroll>
    </div>
  )

  return (<ModalLayout mobileFullScreen>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}