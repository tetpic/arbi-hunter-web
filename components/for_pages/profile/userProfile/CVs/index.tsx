import styles from './index.module.scss'

import { useCvContext } from 'context/cv_state'
import { ICV } from 'data/interfaces/ICV'
import { useEffect, useState } from 'react'
import Spacer from 'components/ui/Spacer'
import ItemNavigation from '@/components/ui/ItemNavigation'
import { useUserContext } from 'context/user_state'
import { getUserImageSource } from 'utils/helpers'
import ProfileCvItem from './ProfileCvItem'
import { useTariffContext } from 'context/tariff_state'
import { ModalType, Preset, PurchaseType } from 'types/enums'
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'
import Title from '@/components/ui/TitleForSection'
import { useRouter } from 'next/router'
import { useAppContext } from 'context/state'
import Button from '@/components/ui/Button'
import PlusSvg from '@/components/svg/PlusSvg'
import { SearchModalArgs } from '@/components/modals/SearchModal'

interface Props {
}

enum CVNavigation {
  Active = 'active',
  Drafts = 'drafts',
  Archive = 'archive',
}

function translate (n: CVNavigation, t: Translate) {
  switch(n) {
    case CVNavigation.Active:
      return t('profile_active')
    case CVNavigation.Drafts:
      return t('profile_drafts')
    case CVNavigation.Archive:
      return t('profile_archive')
  }
}

export default function CVs(props: Props) {
  const {t} = useTranslation()
  const router = useRouter()
  const cvContext = useCvContext()
  const userContext = useUserContext()
  const [activeItem, setActiveItem] = useState<CVNavigation>(CVNavigation.Active)
  const items = Object.values(CVNavigation).map(el=> {return {name: translate(el, t), type: el}})
  const [filteredCvs, setFilteredCvs] = useState<ICV[]>([])
  const [searchedCvs, setSearchedCvs] = useState<ICV[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const tariffContext = useTariffContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  useEffect(()=>{
    cvContext.setSavedCvs()
    tariffContext.setPackets([PurchaseType.CvTariff])
  }, [])

  useEffect(()=>{
    setFilteredCvs(cvContext?.savedCvs)
  }, [cvContext.savedCvs])

  const setFiltered = () => {
    switch(activeItem) {
      case CVNavigation.Active :
        setFilteredCvs((searchedCvs.length > 0? searchedCvs :cvContext?.savedCvs).filter(el => el.published === true && el.moderationStatus === 'approved'))
        break
      case CVNavigation.Archive: 
        setFilteredCvs((searchedCvs.length > 0? searchedCvs :cvContext?.savedCvs).filter(el => (el.moderationStatus !== 'approved'||!el.published)&& el.publishedAt))
        break
      case CVNavigation.Drafts: 
        setFilteredCvs((searchedCvs.length > 0? searchedCvs :cvContext?.savedCvs).filter(el => (el.moderationStatus !== 'approved'||!el.published)&& !el.publishedAt ))
        break
    }
  }

  useEffect(()=>{
    setFiltered()
  }, [activeItem, cvContext.savedCvs, searchedCvs])

  const setFilteredData = (s:string) => {
    const data = cvContext.savedCvs.filter(el => el.categories[0].name.toLowerCase().includes(s.toLowerCase()))
    setSearchedCvs(data)
  }

  const onSearch = (data?: string) => {
    
    isTabletWidth && appContext.showModal<SearchModalArgs>(ModalType.SearchModal, {
      onSearch: (s) => {
        setFilteredData(s)
        setSearchString(s)
      },
      placeholder: t('search_byName'),
      suggestions: [...new Set(cvContext.savedCvs.map(el=> el.categories[0].name)).values()],
      initialValue: searchString
    })
    if(data) {
      setFilteredData(data)
      setSearchString(data)
    }
    else {
      setSearchedCvs([])
    }
  }

  return (
    <div className={styles.root}> 
      <Title 
      title={t('profile_title_myCVs')} 
      onBackClick={router.back} 
      rightButton={isTabletWidth &&
        <div className={styles.buttonsWrapper}>
          <Button styleType={['icon', 'black']} altStyleType={['white', 'icon', 'invertSvg']} onClick={()=>router.push('/create/cv')}><PlusSvg/></Button>
          {/* <Button styleType={['icon', 'black']} onClick={()=>onSearch()}><LoupeSvg/>{searchString&&<DotSvg className={styles.dot} color={colors.green}/>}</Button> */}
        </div>
      }/>
      {/* {!isTabletWidth &&
        <SearchBar 
        key={'cvsSearchbar'}
        className={styles.search} 
        placeholder={t('profile_searchInMyCvs')}
        onSubmit={(data)=>onSearch(data.search)}
        />
      } */}

      <ItemNavigation activeItem={activeItem} items={items} onClick={(n)=>setActiveItem(n)}  onAllWidth={isTabletWidth}/>
      {
      filteredCvs?.length > 0 && 
        (filteredCvs).map((el, index) => 
          <ProfileCvItem  
          cv={el} 
          key={index}
          isLast={index > 0 &&index===filteredCvs.length -1} 
          image={getUserImageSource(userContext.currentProfile, Preset.smallIconCrop)}  
          type={(activeItem===CVNavigation.Drafts&&'drafts')||(activeItem===CVNavigation.Archive&&'archive')||null} 
          />
        )
      }
      <Spacer basis={24}/>
    </div>
  )
}