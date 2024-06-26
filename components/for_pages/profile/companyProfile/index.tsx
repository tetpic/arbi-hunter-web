import Title from 'components/ui/TitleForSection'
import Managers from './Managers'
import Patterns from '../../settings/Patterns'
import Personal from '../Personal'
import Saved from './Saved'
import Shop from './Shop'
import Vacancies from './Vacancies'
import styles from './index.module.scss'
import { NavigationSet } from 'types/types'
import { ProfilePages } from 'context/profile_page_state'
import { TariffWrapper } from 'context/tariff_state'
import { useRouter } from 'next/router'
import { ManagerWrapper } from 'context/manager_state'


interface Props {
  currentPage: ProfilePages 
  navSet: NavigationSet<ProfilePages>[]
  onBackClick?: ()=> void
}

export default function CompanyProfile(props: Props) {

  const choosenNav = props.navSet.find(s => s.type === props.currentPage)
  const router = useRouter()

  const title =  (
    <Title title={choosenNav.name} onBackClick={router.back}/>
  )

  const body = ((): JSX.Element=> {
    switch(props.currentPage) {
      case ProfilePages.Personal:
      return <Personal/>
      case ProfilePages.Managers:
      return (
        <ManagerWrapper>
          <Managers/>
        </ManagerWrapper>
      )
      case ProfilePages.Saved:
      return <Saved/>
      case ProfilePages.Vacancies:
      return <TariffWrapper>
          <Vacancies/>
        </TariffWrapper>
      case ProfilePages.Shop:
      return <Shop/>
      case ProfilePages.Patterns:
      return <Patterns/>
      }
    }
  )()

  return (
   <div className={styles.root}>
   {title||null}
   {body||null}
   </div>
  )
}