import ContentLayout from '@/components/layout/ContentLayout'
import styles from './index.module.scss'
import BackTextButton from '@/components/ui/BackTextButton'
import { useRouter } from 'next/router'
import { CookiesType, InterfaceLanguage } from 'types/enums'
import CategoryRepository from 'data/repositories/CategoryRepository'
import { ISpecializationCategory } from 'data/interfaces/Common'
import CategoryItem from '@/components/ui/CategoriesList/CategoryItem'
import { useAppContext } from 'context/state'
import Title from '@/components/ui/TitleForSection'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  categories: ISpecializationCategory[]
}

export const getServerSideProps = async(ctx: {req: {cookies: {[key:string]: string}}}) => {
  const token = ctx.req.cookies[CookiesType.accessToken]
  const lang = ctx.req.cookies[CookiesType.language] as InterfaceLanguage
  const categories = await CategoryRepository.getCategories(lang)
  return {props: {categories}}
}

export default function RecruitingCategories (props: Props) {
  const router = useRouter()
  const {isTabletWidth} = useAppContext().size
  const {t, lang} = useTranslation()

  const onCategoryClickHandler = (c: ISpecializationCategory) => {
    debugger
    CategoryRepository.getSubCategoriesByCategoryId(c.id, undefined, lang as InterfaceLanguage)
    .then(res => {
      router.push({pathname: '/recruiting', query: {filters: JSON.stringify({categories:res.map(el => el.id)})}})
    })
  }

  return (<ContentLayout hideMobileHeader>
    <div className={styles.root}>
      {!isTabletWidth && <BackTextButton onClick={() => router.back()}/>}
      <Title title={t('categories')} onBackClick={() => router.back()}/>
      
      <div className={styles.wrapper}>
        {props.categories.map(el => {
          return <CategoryItem category={el} imageWrapperClassName={styles.imageWrapper} itemClassName={styles.category} onClick={onCategoryClickHandler}/>
        })}
      </div>
    </div>
  </ContentLayout>)
}