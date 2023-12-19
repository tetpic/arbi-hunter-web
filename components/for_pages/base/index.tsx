import styles from './index.module.scss'

import { ProfileType } from 'data/interfaces/IRegistration'
import DocumentDoubleSvg from 'components/svg/DocumentDoubleSvg'
import TableSvg from 'components/svg/TableSvg'
import { useState } from 'react'
import Navigation from 'components/ui/Navigation'
import SubNavigationSet from 'components/ui/SubNavigationSet'
import ContentBody from 'components/ui/Content/ContentBody'
import ContentAside from 'components/ui/Content/ContentAside'
import Content from 'components/ui/Content'
import Title from 'components/ui/TitleForSection'
import SearchBar from 'components/ui/SearchBar'

interface Props {
  profileType: ProfileType
}


export default function BasePage(props: Props) {
  const [page, pager] = useState<ProfileType>(props.profileType)
  const [currentEmployeeSub, setCurrentEmployeeSub] = useState<{id: number, name: string}>(undefined)
  const [currentHirerSub, setCurrentHirerSub] = useState<{id: number, name: string}>(undefined)


  const employeeSubSet = <SubNavigationSet categories={[
    {name: 'test1', id: 1},
    {name: 'test2', id: 2},
  ]} 
  currentCategory={currentEmployeeSub} 
  setCurrent={setCurrentEmployeeSub}/>

  const hirerSubSet = <SubNavigationSet 
  categories={[
    {name: 'test1', id: 1},
    {name: 'test2', id: 2},
  ]} currentCategory={currentHirerSub} 
  setCurrent={setCurrentHirerSub}/>


  const navSet = (()=>{
    let result = Object.values(ProfileType).map(page => {
      switch(page) {
        case ProfileType.Employee:
          return {name: 'Соискателю', type: page, subSet: employeeSubSet, icon: <DocumentDoubleSvg/>}
        case ProfileType.Hirer:
          return {name: 'Работодателю', type: page, subSet: hirerSubSet, icon: <TableSvg/>}
      }
    })
    return result
  })()


  return (
    <Content className={styles.root}>
      <ContentBody className={styles.body}>
        <Title title={'База знаний'}/>
        <SearchBar placeholder='Поиск по базе знаний'/>
      </ContentBody>
      <ContentAside>
        <Navigation rootClassName={styles.nav} setPage={(p)=> pager(p)} currentPage={page} navSet={navSet}/>
      </ContentAside>
    </Content>
  
  )
}