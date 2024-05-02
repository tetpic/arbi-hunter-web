import ContentLayout from '@/components/layout/ContentLayout'
import styles from './index.module.scss'
import BackTextButton from '@/components/ui/BackTextButton'
import { useRouter } from 'next/router'
import { CookiesType } from 'types/enums'
import CategoryRepository from 'data/repositories/CategoryRepository'
import { ISpecializationCategory } from 'data/interfaces/Common'
import CategoryItem from '@/components/ui/CategoriesList/CategoryItem'
import { useAppContext } from 'context/state'
import Title from '@/components/ui/TitleForSection'

interface Props {
  categories: ISpecializationCategory[]
}

export const getServerSideProps = async(ctx: {req: {cookies: {[key:string]: string}}}) => {
  const token = ctx.req.cookies[CookiesType.accessToken]
  const categories = await CategoryRepository.getCategories()
  return {props: {categories}}
}

export default function RecruitingCategories (props: Props) {
  const router = useRouter()
  const {isTabletWidth} = useAppContext().size

  const onCategoryClickHandler = (c: ISpecializationCategory) => {
    CategoryRepository.getSubCategoriesByCategoryId(c.id)
    .then(res => {
      router.push({pathname: '/recruiting', query: {filters: JSON.stringify({categories:res.map(el => el.id)})}})
    })
  }

  return (<ContentLayout hideMobileHeader>
    <div className={styles.root}>
      {!isTabletWidth && <BackTextButton onClick={() => router.back()}/>}
      <Title title={'Категории'} onBackClick={() => router.back()}/>
      
      <div className={styles.wrapper}>
        {props.categories.map(el => {
          return <CategoryItem category={el} itemClassName={styles.category} onClick={onCategoryClickHandler}/>
        })}
      </div>
    </div>
  </ContentLayout>)
}