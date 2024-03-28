import styles from './index.module.scss'

import Button from 'components/ui/Button'
import classNames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import LoupeSvg from 'components/svg/LoupeSvg'
// import { useAppContext } from 'context/state'
// import { ModalType } from 'types/enums'
// import {  useState } from 'react'
// import { ISearchFilterModalProps } from 'components/modals/SearchFilterModal'
import { ICategory } from 'data/interfaces/Common'
import InputField from '@/components/fields/InputField'
import { Form, FormikHelpers, FormikProvider, useFormik } from 'formik'
import { colors } from 'styles/variables'
import SettingsTwoSlidersSvg from '@/components/svg/SettingsTwoSlidersSvg'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import useTranslation from 'next-translate/useTranslation'

export interface ISearchBarReturnParams {
  activeCategories?: number[]
  activePeriod?: number
  search?: string
}

interface Props {
  className?: string
  fullWidth?: boolean
  onSubmit?: (data: ISearchBarReturnParams)=>void
  placeholder?: string
  categories?: ICategory[]
  periods?: {name: string, value: number}[]
  onFilterClick?: ()=>void
}

/**
 * @className ? string 
 * @fullWidth ? boolean
 * @onChange ?: (s: string)=>void
 * @placeholder ?: string
 */
export default function SearchBar(props: Props) {
  const {isTabletWidth} = useResize()
  const userContext = useUserContext()
  const {t} = useTranslation()
  // const appContext = useAppContext()

  // const [activeCategories, setActiveCategories] = useState<Map<number, ICategory>>(new Map())
  // const [activePeriod, setActivePeriod] = useState<number>()
  // const [search, setSearchValue] = useState('')

  // const setCategories = (data: ICategory[])=>{
  //   setActiveCategories(new Map(data.map(el=>[el.id, el])))
  // }

  // const setPeriod = (data: number)=>{
  //   setActivePeriod(data)
  // }

  const submit = (data: {search?: string}, helpers: FormikHelpers<{search: string;}>)=>{
    
    if(data) {
      props.onSubmit?.(data)  
        
    }
  }


  const openFilters = ()=>{
    // if(props.onFilterClick) {
    //   props.onFilterClick()
    //   return
    // }
    // const options: ISearchFilterModalProps = {
    //   categories: props.categories,
    //   periods: props.periods,
    //   onSubmit: (data)=>{
    //     data?.categories&&setCategories(data?.categories)
    //     setPeriod(data?.period)
    //     submit(data)
    //   },
    //   activeCategories: [...activeCategories.keys()],
    //   activePeriod
    // }
    // if(isTabletWidth) {
    //   appContext.showBottomSheet<ISearchFilterModalProps>(ModalType.SearchFilterModal, options, 0.7)
    //   return
    // }
    // appContext.showModal<ISearchFilterModalProps>(ModalType.SearchFilterModal, options)
  }

  const formik = useFormik({
    initialValues: {
      search: ''
    },
    onSubmit: submit
  })

  return (
    <div className={classNames(styles.container, props.fullWidth&&styles.container_wide)}>
        <FormikProvider value={formik}>
          <Form className={classNames(styles.root, props.className, props.fullWidth&&styles.fullWidth)}>
            <InputField 
            className={styles.input}  
            styleType={'default'} 
            color={'default'} 
            name={'search'} 
            prefix={<LoupeSvg color={colors.greyLight}/>} 
            placeholder={userContext.currentProfile?.profileType===ProfileType.Employee?t('search_vacancy'):t('search_cv')}
            />
            <Button 
            title='search button' 
            onClick={()=> formik.submitForm} 
            styleType={['black']}
            className={!isTabletWidth&&styles.button}
            >
              {t('search')}
            </Button>
            {props.onFilterClick &&
              <Button 
              styleType={['icon', 'black']}
              title='filter button' 
              onClick={openFilters} 
              // className={(activeCategories.size>0||activePeriod)&&styles.filterButton_active}
              >
                <SettingsTwoSlidersSvg/>
              </Button>
            }
          </Form>
        </FormikProvider>
    </div>
  )
}